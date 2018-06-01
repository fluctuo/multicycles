import util from 'util'
import Raven from 'raven'
import config from './config'

const useRaven = !!(config.logger && process.env.NODE_ENV === 'production')

if (useRaven) {
  Raven.config(config.logger).install()
}

export default {
  exception(err, data) {
    if (useRaven) {
      if (err.code && err.code === 'ETIMEDOUT') {
        data.level = 'warning'
      }

      Raven.captureException(err, data)
    } else {
      console.error(util.inspect({ code: err.code, message: err.message, ...data }, { depth: null, colors: true }))
    }
  }
}
