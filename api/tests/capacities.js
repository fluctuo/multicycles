import test from 'ava'
import capacities from '../schema/capacities'

test('Return capacitie for Paris', async t => {
  const capacitie = await capacities.resolve(
    {},
    {
      lat: 48.852775,
      lng: 2.369336
    },
    { state: {} }
  )

  t.deepEqual(capacitie, {
    location: 'Paris, France',
    defaultLanguage: 'fr',
    providers: ['ofo', 'mobike', 'obike', 'donkey', 'lime', 'coup']
  })
})

test('Return capacitie for Tokyo', async t => {
  const capacitie = await capacities.resolve(
    {},
    {
      lat: 35.689487,
      lng: 139.691706
    },
    { state: {} }
  )

  t.deepEqual(capacitie, {
    location: 'Tokyo, Japan',
    defaultLanguage: 'en',
    providers: [
      'bird',
      'byke',
      'coup',
      'donkey',
      'gobeebike',
      'indigowheel',
      'jump',
      'lime',
      'mobike',
      'obike',
      'ofo',
      'pony',
      'spin',
      'whitebikes',
      'yobike'
    ]
  })
})

test('Return capacitie for 0,0', async t => {
  const capacitie = await capacities.resolve(
    {},
    {
      lat: 0,
      lng: 0
    },
    { state: {} }
  )

  t.deepEqual(capacitie, {
    location: 'unknown',
    defaultLanguage: 'en',
    providers: [
      'bird',
      'byke',
      'coup',
      'donkey',
      'gobeebike',
      'indigowheel',
      'jump',
      'lime',
      'mobike',
      'obike',
      'ofo',
      'pony',
      'spin',
      'whitebikes',
      'yobike'
    ]
  })
})
