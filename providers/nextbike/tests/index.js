import test from 'ava'
import nock from 'nock'
import Cacheman from 'cacheman'
import Nextbike from '../lib'

const citiesMock = nock('https://api.nextbike.net')
  .get('/maps/nextbike-live.json')
  .times(5)
  .reply(200, {
    countries: [
      {
        lat: 52.2413,
        lng: 18.479,
        zoom: 6,
        name: 'Nextbike Poland',
        hotline: '+48223821312',
        domain: 'np',
        language: 'pl',
        email: 'info@nextbike.pl',
        timezone: 'Europe/Warsaw',
        currency: 'PLN',
        country_calling_code: '+48',
        system_operator_address: 'nextbike GmbH, Erich-Zeigner Allee 69-73, 04229 Leipzig, Germany',
        country: 'PL',
        country_name: 'Poland',
        terms: 'https://nextbike.pl/regulaminy/',
        policy: '',
        website: 'http://www.nextbike.pl/',
        show_bike_types: false,
        show_bike_type_groups: false,
        show_free_racks: false,
        booked_bikes: 0,
        set_point_bikes: 894,
        available_bikes: 34,
        capped_available_bikes: true,
        pricing: 'http://www.nextbike.pl/',
        cities: []
      },
      {
        lat: 52.5174,
        lng: 13.4055,
        zoom: 11,
        name: 'Deezer nextbike',
        hotline: '+493012086364',
        domain: 'bn',
        language: 'de',
        email: 'kundenservice@nextbike.de',
        timezone: 'Europe/Berlin',
        currency: 'EUR',
        country_calling_code: '+49',
        system_operator_address: 'nextbike GmbH, Erich-Zeigner Allee 69-73, 04229 Leipzig',
        country: 'DE',
        country_name: 'Germany',
        terms: 'https://www.nextbike.de/media/AGB_Juli_2018_dt-en.pdf',
        policy: 'https://www.nextbike.de/datenschutz/',
        website: 'https://www.deezernextbike.de/xx/berlin/',
        show_bike_types: false,
        show_bike_type_groups: false,
        show_free_racks: false,
        booked_bikes: 4,
        set_point_bikes: 2108,
        available_bikes: 1647,
        capped_available_bikes: true,
        pricing: 'https://www.deezernextbike.de/de/berlin/preise/',
        cities: [
          {
            uid: 362,
            lat: 52.5087,
            lng: 13.3563,
            zoom: 12,
            maps_icon: 'deezer',
            alias: 'berlin',
            break: false,
            name: 'Berlin',
            num_places: '1454',
            refresh_rate: '10120',
            bounds: {
              south_west: {
                lat: 52.3867,
                lng: 12.5293
              },
              north_east: {
                lat: 52.6358,
                lng: 13.7605
              }
            },
            booked_bikes: 4,
            set_point_bikes: 2108,
            available_bikes: 1647,
            return_to_official_only: false,
            bike_types: {
              '15': 1107,
              undefined: 2,
              '71': 1
            },
            places: []
          }
        ]
      }
    ]
  })

const vehiclesMock = nock('https://api.nextbike.net')
  .get('/maps/nextbike-live.json')
  .times(4)
  .query({
    city: 362
  })
  .reply(200, {
    countries: [
      {
        lat: 52.2413,
        lng: 18.479,
        zoom: 6,
        name: 'Nextbike Poland',
        hotline: '+48223821312',
        domain: 'np',
        language: 'pl',
        email: 'info@nextbike.pl',
        timezone: 'Europe/Warsaw',
        currency: 'PLN',
        country_calling_code: '+48',
        system_operator_address: 'nextbike GmbH, Erich-Zeigner Allee 69-73, 04229 Leipzig, Germany',
        country: 'PL',
        country_name: 'Poland',
        terms: 'https://nextbike.pl/regulaminy/',
        policy: '',
        website: 'http://www.nextbike.pl/',
        show_bike_types: false,
        show_bike_type_groups: false,
        show_free_racks: false,
        booked_bikes: 0,
        set_point_bikes: 894,
        available_bikes: 34,
        capped_available_bikes: true,
        pricing: 'http://www.nextbike.pl/',
        cities: []
      },
      {
        lat: 52.5174,
        lng: 13.4055,
        zoom: 11,
        name: 'Deezer nextbike',
        hotline: '+493012086364',
        domain: 'bn',
        language: 'de',
        email: 'kundenservice@nextbike.de',
        timezone: 'Europe/Berlin',
        currency: 'EUR',
        country_calling_code: '+49',
        system_operator_address: 'nextbike GmbH, Erich-Zeigner Allee 69-73, 04229 Leipzig',
        country: 'DE',
        country_name: 'Germany',
        terms: 'https://www.nextbike.de/media/AGB_Juli_2018_dt-en.pdf',
        policy: 'https://www.nextbike.de/datenschutz/',
        website: 'https://www.deezernextbike.de/xx/berlin/',
        show_bike_types: false,
        show_bike_type_groups: false,
        show_free_racks: false,
        booked_bikes: 4,
        set_point_bikes: 2108,
        available_bikes: 1647,
        capped_available_bikes: true,
        pricing: 'https://www.deezernextbike.de/de/berlin/preise/',
        cities: [
          {
            uid: 362,
            lat: 52.5087,
            lng: 13.3563,
            zoom: 12,
            maps_icon: 'deezer',
            alias: 'berlin',
            break: false,
            name: 'Berlin',
            num_places: '1454',
            refresh_rate: '10120',
            bounds: {
              south_west: {
                lat: 52.3867,
                lng: 12.5293
              },
              north_east: {
                lat: 52.6358,
                lng: 13.7605
              }
            },
            booked_bikes: 4,
            set_point_bikes: 2108,
            available_bikes: 1647,
            return_to_official_only: false,
            bike_types: {
              '15': 1107,
              undefined: 2,
              '71': 1
            },
            places: [
              {
                uid: 44437,
                lat: 52.504157,
                lng: 13.335328,
                bike: false,
                name: 'Kurfürstendamm',
                address: null,
                spot: true,
                number: 1640,
                bikes: 1,
                bike_racks: 8,
                free_racks: 7,
                maintenance: false,
                terminal_type: 'smart_sign',
                bike_list: [
                  {
                    number: '13385',
                    bike_type: 15,
                    lock_types: ['fork_lock'],
                    active: true,
                    state: 'ok',
                    electric_lock: true,
                    boardcomputer: 20805
                  }
                ],
                bike_numbers: ['13385'],
                bike_types: {
                  '15': 1
                },
                place_type: '0',
                rack_locks: false
              }
            ]
          }
        ]
      }
    ]
  })

test.after(t => {
  t.true(citiesMock.isDone())
  t.true(vehiclesMock.isDone())
})

test('overwrite timeout on constructor', async t => {
  const nextbike = new Nextbike({ timeout: 1 })

  await nextbike
    .getBicyclesByLatLng({
      lat: 52.520007,
      lng: 13.404954
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
  const nextbike = new Nextbike()

  await nextbike
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
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('get bicycles by positions', async t => {
  const nextbike = new Nextbike()

  await nextbike
    .getBicyclesByLatLng({
      lat: 52.520007,
      lng: 13.404954
    })
    .then(result => {
      let hasCities = false
      t.is(result.statusCode, 200)
      t.truthy(result.body.countries.length)
      result.body.countries.forEach(country => {
        if (country.cities.length > 0) {
          hasCities = true
        }
      })

      if (!hasCities) {
        t.fail()
      }
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('share the same cache', async t => {
  const cache = new Cacheman()
  const instanceA = new Nextbike({ datastore: { store: cache } })
  const instanceB = new Nextbike({ datastore: { store: cache } })

  await instanceA
    .getBicyclesByLatLng({
      lat: 52.520007,
      lng: 13.404954
    })
    .then(result => {
      t.is(result.statusCode, 200)
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })

  const cities = await instanceB.getCities()
  t.truthy(cities.length)
})

test('get bicycles at 0,0', async t => {
  const nextbike = new Nextbike()

  await nextbike
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
