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
  plugins: ['~/plugins/highlight'],
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/google-analytics',
    '@nuxtjs/sentry',
    '@nuxtjs/apollo'
  ],
  auth: {
    redirect: {
      home: 'account'
    },
    strategies: {
      auth0: {
        domain: 'multicycles.eu.auth0.com',
        client_id: 'HFpb4x48lzWo1tkkAMY8u5z-bFA1xjQC'
      }
    }
  },
  'google-analytics': {
    id: 'UA-4718334-16'
  },
  sentry: {
    dsn: 'https://6870ab4d97dc4c4abe9d53d5e4b887d0@sentry.io/1223211'
  },
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'http://localhost:3000/v1'
      }
    }
  }
}
