const fastify = require('fastify')()
const fs = require('fs')
const pump = require('pump')

fastify.register(require('fastify-multipart'))

fastify.get('/', function (request, reply) {
    fs.readFile('uploaded-file.jpeg', (err, fileBuffer) => {
      reply
      .headers({
        'Content-Type': 'image/jpeg'
      })
      .send(err || fileBuffer)
    })
  })

fastify.post('/', function (req, reply) {
  const mp = req.multipart(handler, onEnd)
  
  // mp is an instance of
  // https://www.npmjs.com/package/busboy

  function onEnd(err) {
    console.log('upload completed')
    reply.code(200).send()
  }

  function handler (field, file, filename, encoding, mimetype) {
    pump(file, fs.createWriteStream(`uploaded-file.jpeg`))
  }
})

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})