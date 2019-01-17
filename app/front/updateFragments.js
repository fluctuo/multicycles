const axios = require('axios')
const fs = require('fs')

axios
  .post('http://localhost:3000/v1', {
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `
  })
  .then(({ data }) => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = data.data.__schema.types.filter(type => type.possibleTypes !== null)
    data.data.__schema.types = filteredData
    fs.writeFile('./src/fragmentTypes.json', JSON.stringify(data.data), err => {
      if (err) {
        console.error('Error writing fragmentTypes file', err)
      } else {
        console.log('Fragment types successfully extracted!')
      }
    })
  })
