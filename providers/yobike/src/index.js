import SharingOS from '@multicycles/sharingos'

class Yobike {
  constructor({ timeout } = {}) {
    this.sharingos = new SharingOS({
      timeout: timeout && parseInt(timeout, 10),
      appKey: 'WWTaJQrg-NHe_Zl0iwghHyYypYw6g-6GEZHPGBBF6TI7OzZWo9VVLXWRs2ngQJ18'
    })
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

  getObjects({ lat, lng } = {}, config = {}) {
    return this.sharingos.getVehicules({ lat, lng }, config)
  }
}

export default Yobike
