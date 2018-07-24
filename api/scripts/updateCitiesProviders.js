import db from '../db'
import { updateCities } from '../citiesProviders'

db('temp_queries')
  .then(cities => updateCities(cities))
  .then(async () => {
    await db('temp_queries').del()

    console.log('Finished')
    process.exit()
  })
  .catch(err => {
    console.error(err)
    process.exit(err)
  })
