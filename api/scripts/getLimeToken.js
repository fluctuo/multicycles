const readline = require('readline')
const Lime = require('@multicycles/lime')

const lime = new Lime()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Phone number : ', phone => {
  lime.getOTP({ phone }).then(resp => {
    rl.question('OTP : ', code => {
      lime.login({ phone, code }).then(resp => {
        console.log('token:', resp.body.token)
        console.log('cookie:', resp.headers['set-cookie'])

        rl.close()
      })
    })
  })
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})
