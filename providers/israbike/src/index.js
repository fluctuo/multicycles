import SharingOS from '@multicycles/sharingos'

class Israbike {
  constructor({ timeout } = {}) {
    this.sharingos = new SharingOS({
      timeout: timeout && parseInt(timeout, 10),
      appKey: '-1c7WwO5rDCZTBBNyjh3r2iDyWf_r-iPqk3rTrL2dfiK4v6rToGOBGFDuCSf--cw'
    })
  }

  static getProviderDetails() {
    return {
      name: 'IsraBike',
      slug: 'israbike',
      website: 'https://www.facebook.com/IsraBike/',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.gesila.israbike',
        ios: 'https://itunes.apple.com/us/app/id1291237814'
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

export default Israbike
