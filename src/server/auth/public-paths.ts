const STATE_KEY = '__astroParticipantAuthPublicPaths'
const RESERVED = ['/grants', '/roles'] as const

type PublicPathState = {
  [STATE_KEY]?: (pathname: string) => boolean
}

function hasControlCharacter(value: string): boolean {
  for (const char of value) {
    const code = char.charCodeAt(0)
    if (code <= 31 || code === 127) return true
  }
  return false
}

function invalid(path: string): never {
  throw new Error(`公開パスが不正です: ${path}`)
}

function isExactPath(path: string): boolean {
  if (path === '/') return true
  if (!path.startsWith('/') || path.startsWith('//') || path.endsWith('/')) return false
  if (path.includes('\\') || path.includes('?') || path.includes('#') || path.includes('%'))
    return false
  if (path.includes('*') || hasControlCharacter(path)) return false
  const segments = path.split('/').slice(1)
  return segments.every((segment) => segment.length > 0 && segment !== '.' && segment !== '..')
}

function coversReserved(path: string): boolean {
  return RESERVED.some((reserved) => reserved === path || reserved.startsWith(`${path}/`))
}

/** 完全一致。末尾 `/*` はそのパス自身と配下。`/` 全体と `/grants` `/roles` は拒否する。 */
export function compilePublicPaths(paths: readonly string[]): (pathname: string) => boolean {
  const exact = new Set<string>()
  const prefixes: string[] = []

  for (const path of paths) {
    if (path.endsWith('/*')) {
      const prefix = path.slice(0, -2)
      if (prefix === '' || prefix === '/') throw new Error('公開パスを全体にはできません')
      if (!isExactPath(prefix)) invalid(path)
      if (coversReserved(prefix)) throw new Error(`${prefix} は公開にできません`)
      prefixes.push(prefix)
      continue
    }
    if (!isExactPath(path)) invalid(path)
    if (coversReserved(path)) throw new Error(`${path} は公開にできません`)
    exact.add(path)
  }

  return (pathname: string) => {
    if (exact.has(pathname)) return true
    return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  }
}

export function registerPublicPaths(paths: readonly string[]): void {
  const match = compilePublicPaths(paths)
  const globals = globalThis as typeof globalThis & PublicPathState
  globals[STATE_KEY] = match
}

export function isRegisteredPublicPath(pathname: string): boolean {
  const globals = globalThis as typeof globalThis & PublicPathState
  return globals[STATE_KEY]?.(pathname) ?? false
}
