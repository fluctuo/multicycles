import crypto from 'crypto'
import querystring from 'querystring'
import axios from 'axios'

import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'
import getRegion from './regions'

const BASE_URL = 'https://lime.bike/api/partners'
const TOKEN = 'limebike-PMc3qGEtAAXqJa'

function boundsFromLatLng(lat, lng) {
  const latMin = lat - 0.045
  const latMax = lat + 0.045
  const lngMin = lng - 0.045 / Math.cos(lat * Math.PI / 180)
  const lngMax = lng + 0.045 / Math.cos(lat * Math.PI / 180)

  return bboxPolygon([latMin, lngMin, latMax, lngMax])
}

class Lime {
  constructor({ timeout, token } = {}) {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: timeout,
      headers: {
        Authorization: `Bearer ${token || TOKEN}`
      }
    })
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    const bounds = boundsFromLatLng(lat, lng)
    const region = getRegion(lat, lng)

    if (!region) {
      return Promise.resolve({ data: { data: [] } })
    }

    return this.api
      .get('/v1/bikes', {
        data: {
          region
        },
        ...config
      })
      .then(({ data }) => {
        return lat && lng
          ? {
              data: data.data.filter(bike =>
                booleanPointInPolygon(point([bike.attributes.latitude, bike.attributes.longitude]), bounds)
              )
            }
          : data
      })
  }
}

export default Lime
