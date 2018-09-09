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
      },
      {
        type: 'add',
        path: 'api/schema/{{ totalyLower provider}}.js',
        templateFile: 'templates/api/schema.js'
      },
      {
        type: 'add',
        path: 'api/controllers/providers/{{ totalyLower provider}}.js',
        templateFile: 'templates/api/controller.js'
      },
      function customAction(answers) {
        return [
          'Go to work now:',
          '= Provider =',
          '+ Customise provider `getBicyclesByLatLng`',
          ' ',
          '= Api =',
          '+ Add type to `api/schema/index.js`',
          plop.renderString(
            '+ Complete functions on `api/controllers/providers/{{ totalyLower provider }}.js`',
            answers
          ),
          '+ Add new provider to `resolveType` in `api/schema/vehicles.js`',
          '+ Add new provider in `api/utils.js`',
          ' ',
          '= Front =',
          '+ run `npm run fragments`',
          '+ Add new provider in `front/src/store.js`',
          plop.renderString(
            '+ Create `front/static/marker-{{ totalyLower provider }}.png` & `front/static/marker-{{ totalyLower provider }}-2x.png`',
            answers
          ),
          plop.renderString(
            '+ Create `front/src/assets/providers/{{ totalyLower provider }}.jpg` logo 50px x 50px ',
            answers
          ),
          ' ',
          '= Developer',
          '+ Add to Type developer/pages/docs.vue',
          ' ',
          '= Status =',
          '+ Add new components on status website'
        ].join('\n')
      }
    ]
  })
}
