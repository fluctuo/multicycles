import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import cors from '@koa/cors'

import providers from './providers'

const app = new Koa()
const router = new Router()

router.post('/getBicycles', async (ctx, next) => {
  console.log('[/getBicycles]', ctx.request.body)

  try {
    const result = await providers.getBikeByLatLng({
      lat: ctx.request.body.lat,
      lng: ctx.request.body.lng
    })

    // console.log(require('util').inspect(result, { depth: null }))

    ctx.body = result
  } catch (error) {
    console.log(error)
    // ctx.status = err.status || 500;
    // ctx.body = err.message;
    // ctx.app.emit('error', err, ctx);

    ctx.body = {
      error
    }
  }
})

router.get('/', async (ctx, next) => {
  ctx.body = 'toto?'
})

app
  .use(cors())
  .use(bodyparser())
  .use(router.routes())
  .use(router.allowedMethods())
/*.use(async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404) {
        // do somthing here
        console.log("sqdsq");
      }
    } catch (err) {
      // handle error
      console.log("qsdqs", err);
    }
  })*/

app.listen(3000)
