module.exports = api => {
  api.cache.never()
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: '8'
          }
        }
      ]
    ],
    plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-object-rest-spread']
  }
}
