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
  const lngMin = lng - 0.045 / Math.cos(lat * Math.PI / 180)
  const lngMax = lng + 0.045 / Math.cos(lat * Math.PI / 180)

  return `${latMin},${lngMin};${latMax},${lngMax}`
}

class Yobike {
  constructor({ timeout, appKey } = {}) {
    this.appKey = appKey || 'WWTaJQrg-NHe_Zl0iwghHyYypYw6g-6GEZHPGBBF6TI7OzZWo9VVLXWRs2ngQJ18'
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'Yobike',
      slug: 'yobike',
      website: 'https://yobike.com/',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.gesila.yobike',
        ios: 'https://itunes.apple.com/app/id1207509504'
      },
      deepLink: {
        android: null,
        ios: null
      }
    }
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
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
}

export default Yobike
