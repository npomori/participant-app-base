import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import type { AstroIntegration } from 'astro'
import { compilePublicPaths } from './server/auth/public-paths'

const VIRTUAL_CONFIG = 'virtual:astro-participant-auth/config'
const VIRTUAL_PUBLIC = 'virtual:astro-participant-auth/public-paths'
const VIRTUAL_CSS = 'virtual:astro-participant-auth/global.css'
const RESOLVED_CONFIG = '\0virtual:astro-participant-auth/config'
const RESOLVED_PUBLIC = '\0virtual:astro-participant-auth/public-paths'

const PAGES = [
  ['/callback', './pages/callback.astro'],
  ['/logged-out', './pages/logged-out.astro'],
  ['/grants', './pages/grants.astro'],
  ['/roles', './pages/roles.astro']
] as const

export type ParticipantAuthOptions = {
  displayName: string
  publicPaths?: readonly string[]
}

function appRootUrl(root: URL | string): URL {
  if (typeof root === 'string') {
    const withSep = root.endsWith(path.sep) ? root : `${root}${path.sep}`
    return pathToFileURL(withSep)
  }
  return root.href.endsWith('/') ? root : new URL(`${root.href}/`)
}

export default function participantAuth(options: ParticipantAuthOptions): AstroIntegration {
  const displayName = options.displayName.trim()
  if (!displayName) throw new Error('displayName は空にできません')
  const publicPaths = options.publicPaths ?? []
  compilePublicPaths(publicPaths)

  return {
    name: 'astro-participant-auth',
    hooks: {
      'astro:config:setup': ({ addMiddleware, injectRoute, updateConfig, config }) => {
        const cssFile = fileURLToPath(new URL('src/styles/global.css', appRootUrl(config.root)))
        if (!fs.existsSync(cssFile)) {
          throw new Error(`参加アプリの CSS がありません: ${cssFile}`)
        }

        addMiddleware({
          entrypoint: 'astro-participant-auth/middleware',
          order: 'pre'
        })

        for (const [pattern, relative] of PAGES) {
          injectRoute({
            pattern,
            entrypoint: new URL(relative, import.meta.url),
            prerender: false
          })
        }

        updateConfig({
          vite: {
            plugins: [
              {
                name: 'astro-participant-auth-virtual',
                resolveId(id) {
                  if (id === VIRTUAL_CONFIG) return RESOLVED_CONFIG
                  if (id === VIRTUAL_PUBLIC) return RESOLVED_PUBLIC
                  if (id === VIRTUAL_CSS) return cssFile
                  return undefined
                },
                load(id) {
                  if (id === RESOLVED_CONFIG) {
                    return `export const displayName = ${JSON.stringify(displayName)}\n`
                  }
                  if (id === RESOLVED_PUBLIC) {
                    return `export const publicPaths = ${JSON.stringify(publicPaths)}\n`
                  }
                  return undefined
                }
              }
            ],
            ssr: {
              noExternal: ['astro-participant-auth'],
              external: ['@prisma/client', '@prisma/adapter-pg', 'pg', 'ioredis', 'dotenv']
            }
          }
        })
      }
    }
  }
}
