import db from '../../db'
import { updateCities } from '../../citiesProviders'

db('cities_temp')
  .whereNotNull('city')
  .whereNotNull('country')
  .then(cities => updateCities(cities))
  .then(() => {
    console.log('Finished')
    process.exit()
  })
  .catch(err => {
    console.error(err)
    process.exit(err)
  })
