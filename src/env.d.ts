/// <reference types="astro/client" />

declare module 'virtual:participant-app-base/config' {
  export const displayName: string
}

declare module 'virtual:participant-app-base/public-paths' {
  export const publicPaths: readonly string[]
}

declare module 'virtual:participant-app-base/global.css'

declare namespace App {
  interface Locals {
    access: import('./server/auth/access').PageAccess
  }
}
