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
      name: 'Israbike',
      slug: 'Israbike',
      website: 'https://www.facebook.com/IsraBike/',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.gesila.israbike',
        ios:
          'https://itunes.apple.com/us/app/israbike-%D7%99%D7%A9%D7%A8%D7%90%D7%91%D7%99%D7%99%D7%A7/id1291237814?mt=8'
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

export default Israbike
