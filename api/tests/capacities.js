import test from 'ava'
import sinon from 'sinon'
import capacities from '../schema/capacities'
import * as CitiesProviders from '../citiesProviders'

let getProvidersStub

test.before(() => {
  getProvidersStub = sinon.stub(CitiesProviders, 'getProviders')
})

test('Return capacitie for Paris', async t => {
  getProvidersStub.callsFake(() => {
    return ['ofo']
  })

  const capacity = await capacities.resolve(
    {},
    {
      lat: 48.852775,
      lng: 2.369336
    },
    { state: { accessToken: 'ACCESS_TOKEN' } }
  )

  t.deepEqual(capacity, {
    location: 'Paris, France',
    defaultLanguage: 'fr',
    providers: ['ofo']
  })
})
