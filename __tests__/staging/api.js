import r2 from 'r2'
import debug from 'debug'
import sbc from 'servicebus-bus-common'

const log = debug('servicebus-microservice-api')

const config = {
  prefetch: 10,
  queuePrefix: 'test-servicebus-microservice-api',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || '6379'
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672'
  },
  apiUrl: process.env.apiUrl || 'http://localhost:3000'
}

log('service test: rmq', config.rabbitmq.url)

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15 * 1000

const item = {
  todo: 'Eat Pizza',
  complete: false
}
const listName = 'Friday Night Checklist'

describe('api', () => {
  let bus

  beforeAll(async function (done) {
    log('preparing for tests')
    bus = await sbc.makeBus(config)
    done()
  })

  afterAll(() => {
    bus.close()
    log('bus closed')
  })

  it('post to / with item', async (done) => {
    bus.listen('list.item.add', { ack: true }, (data) => {
      expect(data).toBeDefined()
      done()
    })

    const payload = {
      item,
      listName
    }

    setTimeout(async () => {
      let json = await r2.post(config.apiUrl, { json: payload }).json
      expect(json).toEqual({ result: 'success' })
    }, 100)
  })
})
