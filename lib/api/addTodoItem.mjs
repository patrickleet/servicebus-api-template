import log from 'llog'
import rid from 'readable-id-mjs'
import Joi from 'joi'

export const addTodoItem = (req, res) => {
  const { bus } = res
  log.info('processing POST to / ...')

  const addTodoItemRequestSchema = Joi.object().keys({
    listName: Joi.string().required(),
    item: Joi.object().required().keys({
      todo: Joi.string().required(),
      complete: Joi.boolean()
    })
  })

  const { listName, item } = req.body
  const requestOptions = { listName, item }
  const { error } = addTodoItemRequestSchema.validate(requestOptions)
  if (error) {
    log.info({ msg: 'invalid POST request received', details: error.details })
    return res.json({ result: 'failed', error: 'INVALID_PAYLOAD', errorDetails: error.details })
  }

  item.id = rid()
  bus.send('list.item.add', {
    todoListId: listName,
    item
  }, {
    ack: true,
    correlationId: rid()
  }, onMessageSent(res))
}

export const onMessageSent = (res) => {
  return (err) => {
    if (err) {
      log.error({ msg: 'There was an error sending the message', err })
      return res.json({ result: 'failure' })
    }
    log.info('list.item.add messages sent successfully')
    return res.json({ result: 'success' })
  }
}
