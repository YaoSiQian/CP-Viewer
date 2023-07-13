// import colors from 'vuetify/es5/util/colors'
import { NuxtConfig } from '@nuxt/types'

const siteName = process.env.SITE_NAME || 'CoreProtect Viewer'
const pageTitle = process.env.PAGE_TITLE || 'CoreProtect Viewer'
// const baseDir = process.env.BASE_DIR || '/cp'

// const shortHash = execSync('git rev-parse --short HEAD').toString()

const config: NuxtConfig = {
  head: {
    titleTemplate: siteName,
    title: siteName,
    htmlAttrs: {
      lang: 'zh',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'robots', content: 'noindex,nofollow' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: [],

  plugins: [],

  components: true,

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
  ],

  modules: ['@nuxtjs/axios', 'nuxt-clipboard2'],

  axios: {},

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      /*
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
      */
    },
  },

  router: {
    base: '/cp/',
  },

  srcDir: 'src/',

  generate: {
    fallback: true,
  },

  serverMiddleware: ['~/api'],

  telemetry: false,

  server: {
    host: '0.0.0.0',
  },

  publicRuntimeConfig: {
    siteName,
    pageTitle,
  },
}

module.exports = config
