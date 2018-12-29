import test from 'ava'
import { setupTests } from 'ava-nock'
import Moovin from '../lib'

setupTests()

test('overwrite timeout on constructor', async t => {
  const moovin = new Moovin({ timeout: 1 })

  await moovin
    .getObjects({
      lat: 48.856613,
      lng: 2.352222
    })
    .then(() => {
      t.fail()
    })
    .catch(err => {
      // t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('overwrite timeout on method', async t => {
  const moovin = new Moovin()

  await moovin
    .getObjects(
      {
        lat: 48.856613,
        lng: 2.352222
      },
      { timeout: 1 }
    )
    .then(() => {
      t.fail()
    })
    .catch(err => {
      // t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('get bicycles by positions', async t => {
  const moovin = new Moovin()

  await moovin
    .getObjects({
      lat: 48.856613,
      lng: 2.352222
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
