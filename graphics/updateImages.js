const Jimp = require('jimp')

const shema = require('./app/front/src/fragmentTypes.json')

const Vehicles = shema.__schema.types.find(({ name }) => name === 'Vehicle')

const providers = Vehicles.possibleTypes.map(({ name }) => name.toLowerCase())

;(async function() {
  const x = 88
  const y = 98
  const x2 = 2 * x
  const y2 = 2 * y

  const shadow_pos = 35

  // 45x22
  const shadow = await Jimp.read('../masques/Ombre@1x.png')
  // 90x44
  const shadow2x = await Jimp.read('../masques/Ombre@2x.png')

  // 88x98
  const masque = await Jimp.read('../masques/Masque@1xw.png')

  // 176x196
  const masque2x = await Jimp.read('../masques/Masque@2xw.png')

  const markerShadow = new Jimp(x, y, 0xffffffff)
  markerShadow.opacity(0)
  markerShadow.composite(shadow, (x - 45) / 2, y - shadow_pos)

  const markerShadow2x = new Jimp(x2, y2, 0xffffffff)
  markerShadow2x.opacity(0)
  markerShadow2x.composite(shadow2x, (x2 - 90) / 2, y2 - shadow_pos * 2)

  const xM = 48
  const yM = 80

  // 631*1050
  const masqueMulticycles = await Jimp.read('../masques/masque_multicycles.png')
  masqueMulticycles.resize(xM, yM)

  // 45x22
  const markerShadowMulticycles = await Jimp.read('../masques/ombre_multicycles.png')
  markerShadowMulticycles.resize(xM, yM)

  function do_marker(provider_image, x, y, size, masque, markerShadow, shift_provider) {
    //const color = provider_image.getPixelColor(0, 0)
    const marker = new Jimp(x, y, 0xffffffff)

    provider_image = provider_image.clone().resize(size, (size * 1050) / 631)

    marker.composite(provider_image, (x - size) / 2, shift_provider)

    marker.mask(masque)

    const provider_image_with_shadow = markerShadow.clone()
    provider_image_with_shadow.composite(marker, 0, 0)

    return provider_image_with_shadow
  }

  for (const provider of providers) {
    try {
      const provider_image = await Jimp.read(`../masques/calques/${provider}.png`) // 631*1050
      const size = 40
      const shift_provider = 20

      const img = do_marker(provider_image, x, y, size, masque, markerShadow, shift_provider)
      img.write(`../test/${provider}.png`)

      const img2x = do_marker(provider_image, x2, y2, size * 2, masque2x, markerShadow2x, shift_provider * 2)
      img2x.write(`../test/${provider}-2x.png`)

      //provider_image.resize(xM, yM)
      const imgM = do_marker(provider_image, xM, yM, xM, masqueMulticycles, markerShadowMulticycles, 0)
      imgM.write(`../test/${provider}-multicycles-2x.png`)
      imgM.resize(xM / 2, yM / 2)
      imgM.write(`../test/${provider}-multicycles.png`)
    } catch (error) {
      console.error('Failed: ', error)
    }
  }
})()
