import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs/vue'

import i18n from '../i18n'
import SelectedVehicle from '../components/SelectedVehicle.vue'

const providers = {
  bird: 'Bird',
  byke: 'Byke',
  callabike: 'Call a Bike',
  cityscoot: 'Cityscoot',
  coup: 'Coup',
  donkey: 'Donkey Republic',
  gobeebike: 'GobeeBike',
  hellobike: 'Hellobike',
  indigowheel: 'IndigoWheel',
  israbike: 'IsraBike',
  jump: 'Jump',
  lime: 'Lime',
  mobike: 'Mobike',
  nextbike: 'Nextbike',
  obike: 'Obike',
  ofo: 'Ofo',
  pony: 'Pony',
  spin: 'Spin',
  whitebikes: 'Whitebikes',
  wind: 'Wind',
  yobike: 'Yobike'
}

const types = ['BIKE', 'SCOOTER', 'MOTORSCOOTER', 'STATION']

storiesOf('SelectedVehicle', module)
  .addDecorator(withKnobs)
  .add('Bike', () => ({
    i18n,
    components: { SelectedVehicle },
    template: '<selected-vehicle :vehicle="selectedVehicle" />',
    data() {
      return {
        selectedVehicle: {
          id: 'OMgWRP',
          lat: 52.504699846423,
          lng: 13.395806900452,
          type: 'BIKE',
          attributes: ['GEARS'],
          provider: {
            name: 'Ofo',
            slug: 'ofo',
            website: 'https://www.ofo.com',
            discountCode: 'http://promo.ofo.com/Y03poRA',
            app: {
              android: 'https://play.google.com/store/apps/details?id=so.ofo.abroad',
              ios: 'https://itunes.apple.com/us/app/ofo-smart-bike-sharing/id1190831637?mt=8',
              __typename: 'OsLink'
            },
            deepLink: {
              android: 'growing.75b85ae957f8a52b://',
              ios: 'growing.272596a6fc275283://',
              __typename: 'OsLink'
            },
            __typename: 'Provider'
          },
          __typename: 'Ofo'
        }
      }
    }
  }))
  .add('Station', () => ({
    i18n,
    components: { SelectedVehicle },
    template: '<selected-vehicle :vehicle="selectedVehicle" />',
    data() {
      return {
        selectedVehicle: {
          id: '6108612',
          lat: 52.50410157019618,
          lng: 13.39108943939209,
          type: 'STATION',
          attributes: null,
          provider: {
            name: 'Nextbike',
            slug: 'nextbike',
            website: 'https://www.nextbike.net/',
            discountCode: null,
            app: {
              android: 'https://play.google.com/store/apps/details?id=de.nextbike',
              ios: 'https://itunes.apple.com/app/id504288371',
              __typename: 'OsLink'
            },
            deepLink: { android: 'nextbike://', ios: 'nextbike://', __typename: 'OsLink' },
            __typename: 'Provider'
          },
          availableVehicles: 3,
          availableStands: 9,
          isVirtual: false,
          __typename: 'Nextbike'
        }
      }
    }
  }))
  .add('Motor-scooter', () => ({
    i18n,
    components: { SelectedVehicle },
    template: '<selected-vehicle :vehicle="selectedVehicle" />',
    data() {
      return {
        selectedVehicle: {
          id: '9dcbdc89-a5b1-4ec0-bb76-b8f5ef3dd94d',
          lat: 52.5049650000001,
          lng: 13.3942264999998,
          type: 'MOTORSCOOTER',
          attributes: ['ELECTRIC'],
          provider: {
            name: 'Coup',
            slug: 'coup',
            website: 'https://joincoup.com',
            discountCode: null,
            app: {
              android: 'https://play.google.com/store/apps/details?id=com.joincoup.app',
              ios: 'https://itunes.apple.com/app/id1139725011',
              __typename: 'OsLink'
            },
            deepLink: { android: null, ios: null, __typename: 'OsLink' },
            __typename: 'Provider'
          },
          __typename: 'Coup'
        }
      }
    }
  }))
  .add('Scooter', () => ({
    i18n,
    components: { SelectedVehicle },
    template: '<selected-vehicle :vehicle="selectedVehicle" />',
    data() {
      return {
        selectedVehicle: {
          id: '64BYPWFZKVLYS',
          lat: 52.505999,
          lng: 13.39256,
          type: 'BIKE',
          attributes: ['ELECTRIC'],
          provider: {
            name: 'Lime',
            slug: 'lime',
            website: 'https://www.limebike.com/',
            discountCode: null,
            app: {
              android: 'https://play.google.com/store/apps/details?id=com.limebike',
              ios: 'https://itunes.apple.com/app/id1199780189',
              __typename: 'OsLink'
            },
            deepLink: { android: 'https://limebike.app.link', ios: 'https://limebike.app.link', __typename: 'OsLink' },
            __typename: 'Provider'
          },
          __typename: 'Lime'
        }
      }
    }
  }))
  .add('with knobs', () => ({
    i18n,
    components: { SelectedVehicle },
    template: '<selected-vehicle :vehicle="selectedVehicle" />',
    data() {
      return {
        selectedVehicle: {
          id: '10904',
          lat: 52.5044728,
          lng: 13.3927645,
          type: select('Type', types, 'BIKE'),
          attributes: [
            boolean('Gears', false, 'Attributes') ? 'GEARS' : '',
            boolean('Electric', false, 'Attributes') ? 'ELECTRIC' : '',
            boolean('Child seat', false, 'Attributes') ? 'CHILD_SEAT' : '',
            boolean('Cargo', false, 'Attributes') ? 'CARGO' : '',
            boolean('Tandem', false, 'Attributes') ? 'TANDEM' : ''
          ],
          provider: {
            name: text('Name', 'Call a Bike', 'provider'),
            slug: select('Provider', providers, 'callabike', 'provider'),
            website: 'https://www.callabike-interaktiv.de/',
            discountCode: null,
            app: {
              android: 'https://play.google.com/store/apps/details?id=de.bahn.callabike',
              ios: 'https://itunes.apple.com/app/id420360589',
              __typename: 'OsLink'
            },
            deepLink: { android: 'callabike://search', ios: null, __typename: 'OsLink' },
            __typename: 'Provider'
          },
          availableVehicles: number('Available vehicles', 6, 'Station'),
          availableStands: number('Available stands', 2, 'Station'),
          isVirtual: boolean('Is Virtual', false, 'Station'),
          __typename: 'CallABike'
        }
      }
    }
  }))
