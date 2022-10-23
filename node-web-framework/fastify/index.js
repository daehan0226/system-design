// CommonJs
const fastify = require('fastify')({
  logger: false
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 5001 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()