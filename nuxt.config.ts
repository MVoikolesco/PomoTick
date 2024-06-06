// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  target: 'static',
  generate: {
    fallback: true,
  },
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  router: {
    middleware: ['check-route']
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
})
