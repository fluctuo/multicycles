class Noop {
  constructor() {}

  static getProviderDetails() {
    return {
      name: 'Noop',
      slug: 'noop',
      website: 'Noop website',
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

  getObjects() {
    return { body: {} }
  }
}

export default Noop
