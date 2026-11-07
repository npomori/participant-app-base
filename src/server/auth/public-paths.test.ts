import { describe, expect, it } from 'vitest'
import { compilePublicPaths, isRegisteredPublicPath, registerPublicPaths } from './public-paths'

describe('compilePublicPaths', () => {
  it('完全一致と配下を公開する', () => {
    const match = compilePublicPaths(['/', '/about', '/news/*'])
    expect(match('/')).toBe(true)
    expect(match('/about')).toBe(true)
    expect(match('/news')).toBe(true)
    expect(match('/news/123')).toBe(true)
    expect(match('/newsroom')).toBe(false)
    expect(match('/admin')).toBe(false)
    expect(match('/about/more')).toBe(false)
  })

  it('空の一覧はどれにも一致しない', () => {
    const match = compilePublicPaths([])
    expect(match('/')).toBe(false)
    expect(match('/logged-out')).toBe(false)
  })

  it('サイト全体の公開は拒否する', () => {
    expect(() => compilePublicPaths(['/*'])).toThrow('公開パスを全体にはできません')
    expect(() => compilePublicPaths(['///*'])).toThrow('公開パスが不正です: ///*')
  })

  it('管理画面のパスは公開にできない', () => {
    expect(() => compilePublicPaths(['/grants'])).toThrow('/grants は公開にできません')
    expect(() => compilePublicPaths(['/roles'])).toThrow('/roles は公開にできません')
    expect(() => compilePublicPaths(['/grants/*'])).toThrow('/grants は公開にできません')
  })

  it('クエリや上位パスは拒否する', () => {
    expect(() => compilePublicPaths(['/about?x=1'])).toThrow('公開パスが不正です: /about?x=1')
    expect(() => compilePublicPaths(['/../admin'])).toThrow('公開パスが不正です: /../admin')
    expect(() => compilePublicPaths(['about'])).toThrow('公開パスが不正です: about')
  })
})

describe('registerPublicPaths', () => {
  it('登録した照合を入場が読める', () => {
    registerPublicPaths(['/news/*'])
    expect(isRegisteredPublicPath('/news/1')).toBe(true)
    expect(isRegisteredPublicPath('/admin')).toBe(false)
    registerPublicPaths([])
    expect(isRegisteredPublicPath('/news/1')).toBe(false)
  })
})
