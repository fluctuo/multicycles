const { readdirSync } = require('fs')
const Jimp = require('jimp')

const base_path = './providers_base'
const providers = readdirSync(base_path).map(p => p.substr(0, p.length - 4))

;(async function() {
  const x = 880
  const y = 980

  const shadow_pos = 70 * 2

  // 176x196
  const masque = await Jimp.read('./calques/Masque-blanc-880x980.png')

  // 90x44
  const shadow = await Jimp.read('./calques/other.png')

  const xM = 48
  const yM = 80

  // 631*1050
  const masqueMulticycles = await Jimp.read('./calques/masque_multicycles.png')
  masqueMulticycles.resize(xM, yM)

  // 45x22
  const markerShadowMulticycles = await Jimp.read('./calques/ombre_multicycles.png')
  markerShadowMulticycles.resize(xM, yM)

  function do_marker(provider_image, x, y, size, masque, markerShadow, shift_provider) {
    //const color = provider_image.getPixelColor(0, 0)
    const marker = new Jimp(x, y, 0xffffffff)

    provider_image = provider_image.clone().resize(size, (size * 1050) / 631)

    marker.composite(provider_image, (x - size) / 2, shift_provider, {
      mode: Jimp.BLEND_MULTIPLY
    })

    marker.mask(masque)

    const provider_image_with_shadow = shadow.clone()
    provider_image_with_shadow.composite(marker, 0, 0)

    return provider_image_with_shadow
  }

  for (const provider of [providers[0]]) {
    try {
      const provider_image = await Jimp.read(`${base_path}/${provider}.png`) // 631*1050
      const size = 80 * 5
      const shift_provider = 40 * 5

      const img = do_marker(provider_image, 880, 980, size, masque, shadow, shift_provider)
      img.resize(176, 196)
      img.write(`./test/${provider}-2x.png`)
      img.resize(88, 89)
      img.write(`./test/${provider}.png`)

      //provider_image.resize(xM, yM)
      const imgM = do_marker(provider_image, xM, yM, xM, masqueMulticycles, markerShadowMulticycles, 0)
      imgM.write(`./test/${provider}-multicycles-2x.png`)
      imgM.resize(xM / 2, yM / 2)
      imgM.write(`./test/${provider}-multicycles.png`)
    } catch (error) {
      console.error('Failed: ', error)
    }
  }
})()
