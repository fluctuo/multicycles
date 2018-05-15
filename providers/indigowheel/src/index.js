import Yobike from '@multicycles/yobike'

class IndigoWheel {
  constructor({ timeout } = {}) {
    this.yobike = new Yobike({
      timeout,
      appKey: 'NaDl8eR81njaT7FRMNn2oqH020bAfUG7d7Iqa2kMvZm8qCga5cg_QIlk_XZVZvWI'
    })
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    return this.yobike.getBicyclesByLatLng({ lat, lng }, config)
  }
}

export default IndigoWheel
