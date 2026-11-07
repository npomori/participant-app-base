import { sequence } from 'astro/middleware'
import { publicPaths } from 'virtual:astro-participant-auth/public-paths'
import { registerPublicPaths } from '../server/auth/public-paths'
import { access } from './access'

registerPublicPaths(publicPaths)

export const onRequest = sequence(access)
