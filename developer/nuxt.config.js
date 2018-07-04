require('dotenv').config()

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Open-API by Multicycles - The only API for dockless bicycles and other shared vehicles',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Open-API - The only API for dockless bicycles and other shared vehicles'
      }
    ],

    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#151a26' },
      { name: 'msapplication-TileColor', content: '#151a26' },
      { name: 'theme-color', content: '#151a26' }
    ]
  },
  env: {
    MULTICYCLES_API: process.env.MULTICYCLES_API,
    MULTICYCLES_ACCESS_TOKEN: process.env.MULTICYCLES_ACCESS_TOKEN
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#677fb7' },
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

      const vueLoader = config.module.rules.find(rule => rule.loader === 'vue-loader')
      vueLoader.options.transformToRequire = {
        img: 'src',
        image: 'xlink:href',
        'b-img': 'src',
        'b-img-lazy': ['src', 'blank-src'],
        'b-card': 'img-src',
        'b-card-img': 'img-src',
        'b-carousel-slide': 'img-src',
        'b-embed': 'src'
      }
    },
    babel: {
      plugins: ['transform-react-jsx']
    }
  },
  plugins: ['~/plugins/highlight', '~/plugins/filters', '~/plugins/copy', { src: '~/plugins/react', ssr: false }],
  modules: [
    '@nuxtjs/dotenv',
    ['bootstrap-vue/nuxt', { css: false }],
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
