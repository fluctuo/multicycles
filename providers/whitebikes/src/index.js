import querystring from 'querystring'
import axios from 'axios'
import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'

const BASE_URL = 'http://whitebikes.info'

function boundsFromLatLng(lat, lng) {
  const latMin = lat - 0.045
  const latMax = lat + 0.045
  const lngMin = lng - 0.045 / Math.cos(lat * Math.PI / 180)
  const lngMax = lng + 0.045 / Math.cos(lat * Math.PI / 180)

  return bboxPolygon([latMin, lngMin, latMax, lngMax])
}

class WhiteBikes {
  constructor({ timeout } = {}) {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: timeout || 2000
    })
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    let bounds

    if (lat && lng) {
      bounds = boundsFromLatLng(lat, lng)
    }

    return this.api.get('/command.php?action=map:markers', config).then(({ data: bikes }) => {
      return lat && lng ? bikes.filter(bike => booleanPointInPolygon(point([bike.lat, bike.lon]), bounds)) : bikes
    })
  }
}

export default WhiteBikes
