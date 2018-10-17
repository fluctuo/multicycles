import url from 'url'
import got from 'got'

class Gbfs {
  constructor({ timeout, url } = {}) {
    if (!url) {
      throw new Error('Missing `url` field')
    }

    this.url = url
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  systemInfo(config = {}) {
    return got.get(url.resolve(this.url, 'system_information.json'), {
      json: true,
      timeout: this.config.timeout,
      ...config
    })
  }

  stationInfo(config = {}) {
    return got.get(url.resolve(this.url, 'station_information.json'), {
      json: true,
      timeout: this.config.timeout,
      ...config
    })
  }

  stationStatus(config = {}) {
    return got.get(url.resolve(this.url, 'station_status.json'), {
      json: true,
      timeout: this.config.timeout,
      ...config
    })
  }

  freeBikeStatus(config = {}) {
    return got.get(url.resolve(this.url, 'free_bike_status.json'), {
      json: true,
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Gbfs
