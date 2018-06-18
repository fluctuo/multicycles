const path = require('path')

module.exports = plop => {
  plop.addHelper('totalyLower', name => {
    return name.toLowerCase().replace(' ', '')
  })

  plop.setGenerator('provider', {
    description: 'Create a provider',
    prompts: [
      {
        type: 'input',
        name: 'provider',
        message: 'Provider name'
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'providers/{{ totalyLower provider}}/',
        templateFiles: 'templates/provider/**/*',
        base: 'templates/provider/',
        force: true,
        abortOnFail: true
      }
    ]
  })
}
