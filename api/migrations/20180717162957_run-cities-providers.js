const cp = require('child_process')

exports.up = function(knex, Promise) {
  return new Promise((resolve, reject) => {
    const script = cp.spawn('node', ['-r esm -r dotenv/config migrations/scripts/updateCitiesProviders.js'], {
      shell: true
    })

    script.stdout.on('data', data => {
      console.log(data.toString())
    })

    script.stderr.on('data', data => {
      console.error(data.toString())
    })

    script.on('close', code => {
      if (code) {
        return reject(code)
      } else {
        return resolve()
      }
    })
  })
}

exports.down = function(knex, Promise) {
  return knex('cities').truncate()
}

exports.config = { transaction: false }
