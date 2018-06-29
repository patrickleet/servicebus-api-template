import log from 'llog'
import express from 'express'
import { addTodoItem } from '../lib/api/addTodoItem'

export const router = express.Router()

router.post('/', addTodoItem)

log.info('addTodoItem router has been initialized.')

export default router
