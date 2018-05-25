import test from 'ava'
import Byke from '../lib'

test('overwrite timeout on constructor', async t => {
  const byke = new Byke({ timeout: 1 })

  await byke
    .getBicyclesByLatLng({
      lat: 52.520007,
      lng: 13.404954
    })
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ECONNABORTED')
      t.pass()
    })
})

test('overwrite timeout on method', async t => {
  const byke = new Byke()

  await byke
    .getBicyclesByLatLng(
      {
        lat: 52.520007,
        lng: 13.404954
      },
      { timeout: 1 }
    )
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ECONNABORTED')
      t.pass()
    })
})

test('get bicycles by positions', async t => {
  const byke = new Byke()

  await byke
    .getBicyclesByLatLng({
      lat: 52.520007,
      lng: 13.404954
    })
    .then(result => {
      t.truthy(result.data.items.length)
      t.pass()
    })
    .catch(err => {
      console.log(err.response)
      t.fail()
    })
})
