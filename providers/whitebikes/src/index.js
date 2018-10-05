import got from 'got'
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
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'White Bikes',
      slug: 'whitebikes',
      website: 'https://whitebikes.info',
      discountCode: null,
      app: {
        android: null,
        ios: null
      },
      deepLink: {
        android: null,
        ios: null
      }
    }
  }

  getObjects({ lat, lng } = {}, config = {}) {
    let bounds

    if (lat && lng) {
      bounds = boundsFromLatLng(lat, lng)
    }

    return got
      .get(`${BASE_URL}/command.php?action=map:markers`, {
        json: true,
        timeout: this.config.timeout,
        ...config
      })
      .then(({ body: bikes }) => {
        return lat && lng ? bikes.filter(bike => booleanPointInPolygon(point([bike.lat, bike.lon]), bounds)) : bikes
      })
  }
}

export default WhiteBikes
