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
      function customAction(answers) {
        return [
          'Go to work now:',
          '= Provider =',
          '+ Customise provider `getBicyclesByLatLng`',
          ' ',
          '= Front =',
          '+ run `npm run fragments`',
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
