const { readdirSync } = require('fs')
const Jimp = require('jimp')

const base_path = './providers_base'
const providers = readdirSync(base_path).map(p => p.substr(0, p.length - 4))

;(async function() {
  // 880x980
  const masque = await Jimp.read('./calques/Masque-blanc-880x980.png')
  const shadow = await Jimp.read('./calques/other.png')

  // 631*1050
  const masqueMulticycles = await Jimp.read('./calques/masque_multicycles.png')
  const shadowM = await Jimp.read('./calques/other_multicycles.png')

  function do_marker(provider_image, x, y, size, masque, markerShadow, shift_provider) {
    const marker = new Jimp(x, y, 0xffffffff)

    provider_image = provider_image.clone()
    provider_image.resize(size, (size * 1050) / 631)

    marker.composite(provider_image, (x - size) / 2, shift_provider)

    marker.mask(masque)

    const provider_image_with_shadow = markerShadow.clone()
    provider_image_with_shadow.composite(marker, 0, 0)

    return provider_image_with_shadow
  }

  function do_marker_multicycles(provider_image, x, y, masque, markerShadow) {
    const marker = new Jimp(x, y, 0xffffffff)

    provider_image = provider_image.clone()

    marker.composite(provider_image, 0, 0)

    marker.mask(masque)

    marker.composite(markerShadow.clone(), 0, 0)

    return marker
  }

  let count = 0
  for (const provider of providers) {
    try {
      count++
      console.info(`${count}/${providers.length} - ${provider}`)
      const provider_image = await Jimp.read(`${base_path}/${provider}.png`) // 631*1050

      const shift_provider = 210

      const img = do_marker(provider_image, 880, 980, 80 * 5, masque, shadow, shift_provider)
      img.resize(176, 196)
      img.write(`./test/new/${provider}-2x.png`)

      img.resize(88, 89)
      img.write(`./test/new/${provider}.png`)

      const imgM = do_marker_multicycles(provider_image, 631, 1050, masqueMulticycles, shadowM)
      imgM.resize(48, 80)
      imgM.write(`./test/multicycles/${provider}2x.png`)

      imgM.resize(24, 40)
      imgM.write(`./test/multicycles/${provider}.png`)

      const crop = 20
      provider_image.crop(crop, 40, 631 - crop, 631 - 2 * crop)
      provider_image.resize(50, 50)
      provider_image.write(`./test/square/${provider}.png`)
    } catch (error) {
      console.error('Failed: ', error)
    }
  }
})()
