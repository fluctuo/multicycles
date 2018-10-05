import test from 'ava'
import nock from 'nock'
import Lime from '../lib'

nock('https://web-production.lime.bike/api/rider')
  .get('/v1/views/main')
  .query({
    map_center_latitude: 38.907192,
    map_center_longitude: -77.036871,
    user_latitude: 38.907192,
    user_longitude: -77.036871
  })
  .reply(200, {
    data: {
      id: 'views::mainview',
      type: 'main_view',
      attributes: {
        nearby_locked_bikes: [
          {
            id: 'LHBR2L2IPJIOL',
            type: 'bikes',
            attributes: {
              status: 'locked',
              plate_number: null,
              latitude: 38.906641,
              longitude: -77.041698,
              last_activity_at: '2018-08-23T10:19:54.000Z',
              bike_icon: null,
              type_name: 'scooter',
              battery_level: 'high',
              meter_range: 27858,
              rate_plan:
                "<b><font color='#0DC000' size='20' face='Montserrat'>$1</font></b><font color='#4A4A4A' size='16' face='Montserrat'> to unlock + </font><b><font color='#0DC000' size='20' face='Montserrat'>15¢ </font></b> <font color='#4A4A4A' size='16' face='Montserrat'> per 1 minutes</font>",
              rate_plan_short:
                "<b><font color='#7AD319' size='16' face='Montserrat'>$1</font></b><font color='#444A57' size='12' face='Montserrat'> unlock + </font><b><font color='#7AD319' size='16' face='Montserrat'>15¢ </font></b> <font color='#444A57' size='12' face='Montserrat'> / 1 min</font>",
              bike_icon_id: 6,
              last_three: '095'
            }
          }
        ]
      }
    }
  })

test('overwrite timeout on constructor', async t => {
  const lime = new Lime({
    auth: {
      token: process.env.LIME_AUTH_TOKEN,
      session: process.env.LIME_AUTH_SESSION
    },
    timeout: 1
  })

  await lime
    .getObjects({
      lat: 38,
      lng: -77
    })
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('overwrite timeout on method', async t => {
  const lime = new Lime({
    auth: {
      token: process.env.LIME_AUTH_TOKEN,
      session: process.env.LIME_AUTH_SESSION
    }
  })

  await lime
    .getObjects(
      {
        lat: 38,
        lng: -77
      },
      { timeout: 1 }
    )
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('get objects', async t => {
  const lime = new Lime({
    auth: {
      token: process.env.LIME_AUTH_TOKEN,
      session: process.env.LIME_AUTH_SESSION
    }
  })

  await lime
    .getObjects({
      lat: 38.907192, // Washintown, DC
      lng: -77.036871
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.data.attributes.nearby_locked_bikes.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('get bicycles without auth', async t => {
  const lime = new Lime()

  await lime
    .getObjects({
      lat: 48.852775,
      lng: 2.369336
    })
    .then(result => {
      console.log(result)
      t.fail()
    })
    .catch(err => {
      t.pass()
    })
})
