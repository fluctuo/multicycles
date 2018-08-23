import test from 'ava'
import nock from 'nock'
import Coup from '../lib'

nock('https://app.joincoup.com/api')
  .get('/v3/markets')
  .times(5)
  .reply(200, {
    meta: {
      server_time: '2018-07-03T18:44:29.565Z',
      status: 0,
      key: 'OK'
    },
    data: {
      markets: [
        {
          id: 'b6f7c282-984b-4432-8f0f-435ebaf25373',
          code: 'paris',
          name: 'Paris',
          country: 'FR',
          language: 'fr',
          terms_of_service_version: 1,
          time_zone: 'Europe/Paris',
          customer_support_phone_number: '+33 9 73 72 93 72',
          location: {
            lng: 2.335955,
            lat: 48.8734618
          },
          terms_of_service_url: {
            en: 'https://joincoup.com/en/paris/faq/terms-and-conditions',
            fr: 'https://joincoup.com/fr/paris/faq/conditions-generales-de-location',
            de: 'https://joincoup.com/de/paris/faq/agb',
            es: 'https://joincoup.com/es/paris/faq/terminos-y-condiciones'
          },
          data_privacy_url: {
            en: 'https://joincoup.com/en/paris/faq/data-privacy-app',
            fr: 'https://joincoup.com/fr/paris/faq/politique-de-confidentialite-de-l-application',
            de: 'https://joincoup.com/de/paris/faq/datenschutzhinweise-app',
            es: 'https://joincoup.com/es/paris/faq/aplicacion-de-privacidad-de-datos'
          },
          newsletter_conditions_url: {
            en: 'https://joincoup.com/en/paris/faq/data-privacy-website#newsletter',
            fr: 'https://joincoup.com/fr/paris/faq/politique-de-confidentialite-du-site#newsletter',
            de: 'https://joincoup.com/de/paris/faq/datenschutzhinweise-website#newsletter',
            es: 'https://joincoup.com/es/paris/faq/sitio-web-de-privacidad-de-datos'
          },
          support_url: {
            en: 'https://joincoup.com/en/paris/faq',
            fr: 'https://joincoup.com/fr/paris/faq',
            de: 'https://joincoup.com/de/paris/faq',
            es: 'https://joincoup.com/es/paris/faq/'
          }
        }
      ]
    }
  })

nock('https://app.joincoup.com/api')
  .get('/v3/markets/b6f7c282-984b-4432-8f0f-435ebaf25373/business_areas')
  .times(5)
  .reply(200, {
    meta: {
      server_time: '2018-07-03T18:44:46.936Z',
      status: 0,
      key: 'OK'
    },
    data: {
      business_areas: [
        {
          id: '5b013f84-ba18-48e3-baa5-0278e01ba016',
          name: 'Paris - Current Business Area - updated 4thMAY2018',
          polygon: [
            [
              [2.2640419, 48.8575293],
              [2.2586346, 48.8488956],
              [2.2582054, 48.8485884],
              [2.2582912, 48.8473988],
              [2.2573793, 48.8455985],
              [2.255432, 48.8449859],
              [2.254976, 48.8436532],
              [2.2544182, 48.8426753],
              [2.2546247, 48.841512],
              [2.2557686, 48.8395666],
              [2.2567329, 48.8385198],
              [2.2578889, 48.8383185],
              [2.2577467, 48.8374526],
              [2.2613651, 48.8367986],
              [2.2635591, 48.8364507],
              [2.2673196, 48.8396566],
              [2.2697335, 48.8384845],
              [2.274347, 48.8368197],
              [2.2781932, 48.8359281],
              [2.2807268, 48.8352313],
              [2.28253, 48.8346975],
              [2.2835067, 48.8342293],
              [2.2868035, 48.8329111],
              [2.2890836, 48.8321607],
              [2.2920876, 48.830854],
              [2.2921088, 48.8291518],
              [2.2930126, 48.8291253],
              [2.2941095, 48.8289293],
              [2.3073612, 48.8258838],
              [2.3096317, 48.8254899],
              [2.3110878, 48.8250268],
              [2.3124209, 48.8247602],
              [2.3137271, 48.8245642],
              [2.3172195, 48.8235825],
              [2.3178337, 48.8237997],
              [2.3247519, 48.8221596],
              [2.3260224, 48.8217688],
              [2.3297024, 48.8209088],
              [2.3336614, 48.8200858],
              [2.3439502, 48.817864],
              [2.3445189, 48.8179418],
              [2.3447442, 48.819284],
              [2.346611, 48.8197643],
              [2.3475122, 48.8193829],
              [2.3479843, 48.8185069],
              [2.3486066, 48.8187259],
              [2.348907, 48.8190226],
              [2.348907, 48.8190932],
              [2.3490894, 48.8191003],
              [2.350409, 48.819722],
              [2.351675, 48.820061],
              [2.3522758, 48.8201599],
              [2.3526835, 48.8202306],
              [2.3530269, 48.8202023],
              [2.3540139, 48.8203153],
              [2.3551726, 48.8197361],
              [2.3560739, 48.8190014],
              [2.3568249, 48.8180124],
              [2.3568034, 48.8176521],
              [2.3597646, 48.8180089],
              [2.3626828, 48.8178782],
              [2.3655475, 48.8189025],
              [2.3689485, 48.8200893],
              [2.3702145, 48.8205555],
              [2.3713303, 48.8209546],
              [2.3725319, 48.8213397],
              [2.3741627, 48.8218482],
              [2.3781537, 48.8227877],
              [2.3772847, 48.8240168],
              [2.3807018, 48.8251646],
              [2.3812866, 48.8263265],
              [2.3850847, 48.8281276],
              [2.3839688, 48.8290599],
              [2.3901271, 48.83269],
              [2.3938394, 48.8341661],
              [2.3993245, 48.8307374],
              [2.4008507, 48.8309598],
              [2.4027443, 48.831433],
              [2.4039674, 48.8322593],
              [2.4044931, 48.8329585],
              [2.405802, 48.8333752],
              [2.4077117, 48.8344063],
              [2.4094821, 48.836546],
              [2.4094498, 48.8369838],
              [2.4101365, 48.8380219],
              [2.4086452, 48.8382655],
              [2.4088169, 48.8387352],
              [2.410158, 48.8428444],
              [2.4115206, 48.8470666],
              [2.4117673, 48.8489095],
              [2.4113274, 48.85071],
              [2.4091387, 48.8643195],
              [2.4090958, 48.8727318],
              [2.4072933, 48.8771068],
              [2.406478, 48.8779112],
              [2.4026155, 48.8788002],
              [2.398796, 48.8800702],
              [2.3992896, 48.8805006],
              [2.3981738, 48.8811145],
              [2.3968756, 48.8819188],
              [2.3966503, 48.8830336],
              [2.3971224, 48.8832311],
              [2.3954916, 48.8897216],
              [2.3892582, 48.8880638],
              [2.3883891, 48.8896228],
              [2.3878207, 48.8894992],
              [2.3832822, 48.8960771],
              [2.3795758, 48.8962627],
              [2.3764919, 48.8968292],
              [2.3722554, 48.8957051],
              [2.3712068, 48.8966731],
              [2.3716844, 48.8973678],
              [2.3691363, 48.8973858],
              [2.3602796, 48.8981154],
              [2.3529196, 48.8979709],
              [2.3528123, 48.8987009],
              [2.3446369, 48.8983768],
              [2.3445081, 48.8986939],
              [2.3226964, 48.8983589],
              [2.3208778, 48.8986128],
              [2.3145855, 48.8961618],
              [2.3143173, 48.8953364],
              [2.3131907, 48.8946664],
              [2.3039044, 48.8904695],
              [2.3026114, 48.8913442],
              [2.2950053, 48.8876052],
              [2.2939539, 48.8885082],
              [2.2912931, 48.8874359],
              [2.28477, 48.8833158],
              [2.2836542, 48.8824974],
              [2.2815514, 48.8790825],
              [2.280736, 48.8775866],
              [2.2785365, 48.8751099],
              [2.2753393, 48.8722167],
              [2.2749209, 48.8715534],
              [2.2708654, 48.8667756],
              [2.2676682, 48.8630279],
              [2.2640419, 48.8575293]
            ]
          ],
          active: true
        }
      ]
    }
  })

nock('https://app.joincoup.com/api')
  .get('/v3/markets/b6f7c282-984b-4432-8f0f-435ebaf25373/scooters')
  .times(4)
  .reply(200, {
    meta: {
      server_time: '2018-06-27T13:55:52.302Z',
      status: 0,
      key: 'OK'
    },
    data: {
      scooters: [
        {
          id: 'c5bb1838-a27e-4d7f-9eb8-29f5b476999c',
          vin: 'RHMGRSAN0GT100308',
          model: 'Gogoro 1st edition',
          market_id: 'fb7aadac-bded-4321-9223-e3c30c5e3ba5',
          license_plate: '506ERE',
          energy_level: 87,
          distance_to_travel: 52.2,
          location: {
            lng: 13.3902215601651,
            lat: 52.5085336960947
          }
        }
      ]
    }
  })

test('Get markets', async t => {
  const coup = new Coup()

  await coup.getMarkets().then(() => {
    t.truthy(coup.markets.length)
    t.pass()
  })
})

test('overwrite timeout on constructor', async t => {
  const coup = new Coup({ timeout: 1 })

  await coup
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222
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
  const coup = new Coup()

  await coup
    .getBicyclesByLatLng(
      {
        lat: 48.856614,
        lng: 2.352222
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

test('get bicycles by positions', async t => {
  const coup = new Coup()

  await coup
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.data.scooters.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('return not covered at 0,0', async t => {
  const coup = new Coup()

  await coup
    .getBicyclesByLatLng({
      lat: 0.1,
      lng: 0.1
    })
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.toString(), 'Error: Not Covered')
      t.pass()
    })
})
