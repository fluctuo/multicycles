const readline = require('readline')
const Ofo = require('@multicycles/ofo')

const ofo = new Ofo()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Country code : ', ccc => {
  rl.question('Mobile tel number : ', tel => {
    ofo.getOTP({ tel, ccc }).then(resp => {
      console.log(resp.data)

      rl.question('OTP : ', code => {
        ofo.login({ tel, code, ccc }).then(resp => {
          console.log(resp.data)

          rl.close()
        })
      })
    })
  })
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})
