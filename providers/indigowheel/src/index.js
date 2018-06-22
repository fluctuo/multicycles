import Yobike from '@multicycles/yobike'

class IndigoWheel {
  constructor({ timeout } = {}) {
    this.yobike = new Yobike({
      timeout: timeout && parseInt(timeout, 10),
      appKey: 'NaDl8eR81njaT7FRMNn2oqH020bAfUG7d7Iqa2kMvZm8qCga5cg_QIlk_XZVZvWI'
    })
  }

  static getProviderDetails() {
    return {
      name: 'INDIGO wheel',
      slug: 'indigowheel',
      website: 'https://www.indigoweel.com/',
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.gesila.indigo',
        ios: 'https://itunes.apple.com/app/id1317216469'
      }
    }
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    return this.yobike.getBicyclesByLatLng({ lat, lng }, config)
  }
}

export default IndigoWheel
