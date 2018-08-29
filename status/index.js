import got from 'got'

const client = got.extend({
  baseUrl: process.env.CACHET_URL,
  json: true,
  headers: {
    'X-Cachet-Token': process.env.API_KEY
  }
})

function getComponents() {
  return client.get('/components?per_page=50').then(resp => resp.body.data)
}

function checkProviders() {
  return got(`${process.env.MULTICYCLES_API}/checkproviders`, {
    json: true,
    timeout: 10000,
    auth: process.env.MULTICYCLES_AUTH
  }).then(resp => resp.body)
}

function hasDifferentStatus({ status }, { working }) {
  return (working && status !== 1) || (!working && status !== 3)
}

function setComponentStatus(component, working) {
  return client.put(`/components/${component.id}`, {
    json: true,
    body: {
      component_id: component.id,
      status: working ? 1 : 3
    }
  })
}

Promise.all([getComponents(), checkProviders()]).then(([components, providers]) => {
  return Promise.all(
    providers.map(provider => {
      const component = components.find(c => c.tags.provider && c.tags[provider.provider])

      if (component && hasDifferentStatus(component, provider)) {
        return setComponentStatus(component, provider.working)
      } else {
        return Promise.resolve()
      }
    })
  )
})

process.on('unhandledRejection', error => {
  console.error(error)
})
