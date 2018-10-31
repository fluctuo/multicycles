require('dotenv').config()

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'The only API for dockless bicycles and other shared vehicles',
    titleTemplate: '%s - Open-API by Multicycles',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Open-API is the only API for find dockless bicycles and other shared vehicles like scooters. Explore and get instant vehicles positions in a single query. Available wordwide, the api return standardized data.'
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary'
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'The only API for dockless bicycles and other shared vehicles - Open-API by Multicycles'
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          'Open-API is the only API for find dockless bicycles and other shared vehicles like scooters. Explore and get instant vehicles positions in a single query. Available wordwide, the api return standardized data.'
      },
      {
        hid: 'twitter:site',
        name: 'twitter:site',
        content: '@multicycles'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'The only API for dockless bicycles and other shared vehicles - Open-API by Multicycles'
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'The only API for dockless bicycles and other shared vehicles - Open-API by Multicycles'
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content:
          'Open-API is the only API for find dockless bicycles and other shared vehicles like scooters. Explore and get instant vehicles positions in a single query. Available wordwide, the api return standardized data.'
      },
      {
        hid: 'og:locale',
        name: 'og:locale',
        content: 'en_US'
      },
      {
        hid: 'og:type',
        name: 'og:type',
        content: 'website'
      }
    ],

    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#151a26' },
      { name: 'msapplication-TileColor', content: '#151a26' },
      { name: 'theme-color', content: '#151a26' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Oswald:300' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#677fb7' },
  /*
  ** Build configuration
  */
  build: {
    extend(config, { isDev, isClient }) {
      config.module.rules.push({
        test: /\.flow$/,
        loader: 'ignore-loader'
      })

      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      const vueLoader = config.module.rules.find(rule => rule.loader === 'vue-loader')
      vueLoader.options.transformAssetUrls = {
        video: ['src', 'poster'],
        source: 'src',
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
      plugins: ['transform-react-jsx'],
      ignore: ['*.flow']
    }
  },
  plugins: ['~/plugins/highlight', '~/plugins/filters', '~/plugins/copy', '~/plugins/react'],
  modules: [
    '@nuxtjs/dotenv',
    [
      'nuxt-env',
      {
        keys: ['MULTICYCLES_API', 'MULTICYCLES_ACCESS_TOKEN', 'SENTRY_KEY', 'ANALYTICS_KEY']
      }
    ],
    ['bootstrap-vue/nuxt', { css: false }],
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/google-analytics',
    '@nuxtjs/sentry',
    '@nuxtjs/apollo',
    '@nuxtjs/moment',
    'nuxt-leaflet'
  ],
  auth: {
    plugins: ['~/plugins/me.js'],
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
