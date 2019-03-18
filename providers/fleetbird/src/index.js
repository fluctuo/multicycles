import got from 'got'

class Fleetbird {
  constructor({ timeout, url } = {}) {
    this.url = url
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  getCars(config = {}) {
    return got.get(`${this.url}/cars`, {
      json: true,
      timeout: this.config.timeout,
      ...config
    })
  }

  getTerritories(config = {}) {
    return got.get(`${this.url}/territories/all`, {
      json: true,
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Fleetbird
