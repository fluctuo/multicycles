import crypto from 'crypto'
import querystring from 'querystring'
import axios from 'axios'

const BASE_URL = 'https://en.api.ohbike.com'
const api = axios.create({
  baseURL: BASE_URL
})

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

export default {
  getBicyclesByLatLng({ lat, lng } = {}) {
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
      ak: 'WWTaJQrg-NHe_Zl0iwghHyYypYw6g-6GEZHPGBBF6TI7OzZWo9VVLXWRs2ngQJ18',
      bounds: boundsFromLatLng(lat, lng),
      zoom: '11.000000'
    }

    return api.post(
      '/v1/vehicle/',
      querystring.stringify({
        ...data,
        sign: sign(data)
      })
    )
  }
}
