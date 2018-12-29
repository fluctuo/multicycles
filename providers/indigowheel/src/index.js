import SharingOS from '@multicycles/sharingos'

class IndigoWheel {
  constructor({ timeout } = {}) {
    this.sharingos = new SharingOS({
      timeout: timeout && parseInt(timeout, 10),
      appKey: 'NaDl8eR81njaT7FRMNn2oqH020bAfUG7d7Iqa2kMvZm8qCga5cg_QIlk_XZVZvWI'
    })
  }

  static getProviderDetails() {
    return {
      name: 'INDIGO wheel',
      slug: 'indigowheel',
      website: 'https://www.indigoweel.com/',
      discountCode: 'http://eu.static.bikesharingos.com/ShareInvitingPage/IndigoWeel/index.html?code=8D9VS8S',
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.gesila.indigo',
        ios: 'https://itunes.apple.com/app/id1317216469'
      },
      deepLink: {
        android: null,
        ios: null
      }
    }
  }

  getObjects({ lat, lng } = {}, config = {}) {
    return Promise.all([
      this.sharingos.getVehicules({ lat, lng }, config),
      this.sharingos.getScooters({ lat, lng }, config)
    ])
  }
}

export default IndigoWheel
