import { addTodoItem, onMessageSent } from 'api/addTodoItem.mjs'

// jest.mock('llog')

const res = {
  bus: {
    publish: jest.fn(),
    send: jest.fn()
  },
  end: jest.fn(),
  json: jest.fn()
}

const item = {
  todo: 'Eat Pizza',
  complete: false
}
const listName = 'Friday Night Checklist'

describe('api/addTodoItem', () => {
  describe('addTodoItem', () => {
    it('should publish list.item.add commands', () => {
      const req = {
        body: {
          listName,
          item
        }
      }
      addTodoItem(req, res)

      expect(res.bus.send).toBeCalledWith(
        'list.item.add',
        {
          item: {
            todo: item.todo,
            id: expect.any(String),
            complete: false
          },
          todoListId: listName
        }, {
          ack: true,
          correlationId: expect.any(String)
        },
        expect.any(Function)
      )
    })

    it(`returns { result: 'failed' } when no listName provided`, () => {
      const req = {
        body: {
          item
        }
      }
      addTodoItem(req, res)
      expect(res.json).toBeCalledWith({ error: 'INVALID_PAYLOAD', result: 'failed', errorDetails: expect.any(Object) })
    })

    it(`returns { result: 'failed' } when no items provided`, () => {
      const req = {
        body: {
          listName
        }
      }
      addTodoItem(req, res)
      expect(res.json).toBeCalledWith({ error: 'INVALID_PAYLOAD', result: 'failed', errorDetails: expect.any(Object) })
    })
  })

  describe('onMessageSent', () => {
    it('returns a response', () => {
      let newRes = {
        json: jest.fn()
      }

      let fn = onMessageSent(newRes)
      fn()
      expect(newRes.json).toBeCalledWith({'result': 'success'})
    })
    it('error', () => {
      let failRes = {
        json: jest.fn()
      }
      let failfn = onMessageSent(failRes)
      failfn('err')
      expect(failRes.json).toBeCalledWith({'result': 'failure'})
    })
  })
})
