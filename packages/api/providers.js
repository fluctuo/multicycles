import ofo from '@multicycle/ofo'
import gobee from '@multicycle/gobee.bike'

export default {
  getBikeByLatLng(data) {
    return (
      Promise.all([
        ofo.getBicyclesByLatLng(data),
        gobee.getBicyclesByLatLng(data)
      ])
        // .then() check 200
        .then(result => [
          ...result[0].data.values.cars.map(bike => ({
            provider: 'ofo',
            lat: bike.lat,
            lng: bike.lng
          })),
          ...result[1].data.data.bikes.map(bike => ({
            provider: 'gobee',
            id: bike.bid,
            number: bike.number,
            lat: bike.gLat,
            lng: bike.gLng
          }))
        ])
    )
  }
}
