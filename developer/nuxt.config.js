require('dotenv').config()

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Multicycles Open API - Developer portal',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Multicycles Open API - Developer portal' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  plugins: ['~/plugins/highlight', '~/plugins/filters', '~/plugins/copy'],
  modules: [
    '@nuxtjs/dotenv',
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/google-analytics',
    '@nuxtjs/sentry',
    '@nuxtjs/apollo',
    '@nuxtjs/moment'
  ],
  auth: {
    redirect: {
      home: '/account',
      callback: '/callback'
    },
    strategies: {
      auth0: {
        domain: 'multicycles.eu.auth0.com',
        client_id: 'fOYk1TlPc20pzwVhTpN4eKuji7SUbPgM',
        userinfo_endpoint: false,
        token_key: 'id_token'
      }
    }
  },
  'google-analytics': {
    id: process.env.ANALYTICS_KEY || 'UA-000000-1'
  },
  sentry: {
    dsn: process.env.SENTRY_KEY
  },
  apollo: {
    clientConfigs: {
      default: '~/apollo/default.js'
    }
  }
}
