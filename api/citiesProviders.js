import db from './db'
import { reverseGeocode } from './geolocation'
import { allProviders } from './utils'

function flat(arr) {
  return arr.reduce((r, a) => [...r, ...a])
}

function getProviders({ lat, lng }) {
  return db('cities')
    .whereRaw(`ST_Intersects(bbox, ST_Point(${lng}, ${lat}))`)
    .then(cities => (cities.length ? [...new Set(flat(cities.map(c => c.providers)))] : allProviders))
}

function saveProvidersToCity(city, providers) {
  return db('cities')
    .where({
      id: city.id
    })
    .update({
      providers: [...new Set(city.providers.concat(providers))]
    })
}

function updateCity(city) {
  if (!city.providers || !city.providers.length) {
    return Promise.resolve()
  }

  return db('cities')
    .whereRaw(`ST_Intersects(bbox, ST_Point(${city.lng}, ${city.lat}))`)
    .then(cities => {
      if (cities.length) {
        return Promise.all(cities.map(c => saveProvidersToCity(c, city.providers)))
      } else {
        return reverseGeocode({
          lat: city.lat,
          lng: city.lng
        }).then(geocode =>
          db('cities')
            .insert({
              city: city.city,
              country: city.country,
              bbox: db.raw(`ST_MakeEnvelope(${geocode.bbox.join(',')})`),
              providers: city.providers
            })
            .catch(err => {
              console.log('err', city, geocode)
            })
        )
      }
    })
}

async function updateCities(cities) {
  for (let index = 0; index < cities.length; index++) {
    await updateCity(cities[index])
  }
}

export { getProviders, updateCities }
