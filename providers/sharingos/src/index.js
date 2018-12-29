import crypto from 'crypto'
import got from 'got'

const BASE_URL = 'https://en.api.ohbike.com'

function sign(a) {
  var c = [],
    g,
    k
  for (k in a) (g = a[k]), void 0 == g && ((g = ''), (a[k] = '')), c.push(g)
  c.sort()

  a = ''
  for (k in c) a += c[k]

  return crypto
    .createHash('md5')
    .update(`${a}@ohbile`)
    .digest('hex')
}

function boundsFromLatLng(lat, lng) {
  const latMin = lat - 0.045
  const latMax = lat + 0.045
  const lngMin = lng - 0.045 / Math.cos((lat * Math.PI) / 180)
  const lngMax = lng + 0.045 / Math.cos((lat * Math.PI) / 180)

  return `${latMin},${lngMin};${latMax},${lngMax}`
}

class SharingOS {
  constructor({ timeout, appKey } = {}) {
    if (!appKey) {
      throw new Error('Missing appKey')
    }

    this.appKey = appKey
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  getVehicules({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    const data = {
      lat,
      lng,
      distance: 700,
      coord_type: 1,
      t: 'geonear',
      ts: +new Date() / 1000,
      ak: this.appKey,
      bounds: boundsFromLatLng(lat, lng),
      zoom: '11.000000'
    }

    return got.post(`${BASE_URL}/v1/vehicle/`, {
      json: true,
      form: true,
      body: {
        ...data,
        sign: sign(data)
      },
      timeout: this.config.timeout,
      ...config
    })
  }

  getScooters({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    const data = {
      lat,
      lng,
      distance: 700,
      coord_type: 1,
      t: 'geonear',
      ts: +new Date() / 1000,
      ak: this.appKey,
      bounds: boundsFromLatLng(lat, lng),
      zoom: '11.000000'
    }

    return got.post(`${BASE_URL}/v1/scooter/`, {
      json: true,
      form: true,
      body: {
        ...data,
        sign: sign(data)
      },
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default SharingOS
