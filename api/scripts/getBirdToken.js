const readline = require('readline')
const Bird = require('@multicycles/bird')

const bird = new Bird()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Email : ', email => {
  bird.login({ email }).then(resp => {
    console.log('token:', resp.body.token)

    rl.close()
  })
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})
