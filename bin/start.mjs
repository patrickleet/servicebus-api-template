#!/bin/sh
':' //# https://cloudnative.institute ; exec /usr/bin/env node --experimental-modules "$0" "$1"

import log from 'llog'
import errortrap from 'errortrap'
import servicebus from 'servicebus-bus-common'
import { config } from '../config.mjs'
import api from 'express-api-common'
import addTodoItem from '../routes/addTodoItem.mjs'

// 🔥 Welcome to my opinionated servicebus boilerplate! 🔥

// errortrap logs uncaught exceptions with llog before
// throwing an error
errortrap()

export const start = async (onStart) => {
  // `servicebus-bus-common.makeBus` creates a new instance of servicebus.bus
  // using commonly used servicebus middleware
  //
  // Servicebus is kinda lika an event emitter for your whole system.
  // You can emit an event in one service. Then you can listen for that event in another service.
  // It is also fault tolerant and scalable.
  // It's backed by RabbitMQ and Redis.
  // It's been used in production for years in financial transactions with large volumes, AI projects
  // and at least one blockchain based company.
  //
  // bus's have 4 main functions - send/listen for command and publish/subscribe for events
  //
  // It's also great for building systems with CQRS/ES.
  // Command Query Responsibility Segregation with Event Sourcing.
  //
  // Here's a really great video about it from the library's author, and good friend Matt Walters:
  // https://www.youtube.com/watch?v=4k7bLtqXb8c
  //
  log.info('connecting to servicebus')
  const bus = await servicebus.makeBus(config.servicebus)
  log.info('connected to servicebus')

  // "express-api-common" simply creates an express server using commonly
  // used express middleware, such as prometheus exporters
  // for autoscaling purposes
  //
  // "log" is an instance of llog, a "leveled logger".
  // It's actually just logging with pino, but it is a singleton
  // so you don't need to create it elsewhere, which can throw off your logs
  // by saying the file it came from is the singleton file, which is much less helpful!
  //
  // I'm assuming your logging strategy is "log to stdout" and pick it up with an external tool.
  // Microservices shouldn't have to care about shipping logs.
  //
  // We'll also pass an instance of our bus. api.makeServer will also use `express-servicebus` to
  // make the bus available on the response object.
  //
  const server = api.makeServer({
    bus,
    logger: log
  })

  server.use('/', addTodoItem)
  log.info('addTodoItem router registered with server')

  server.start(config.PORT, onStart)
}

export const onStart = () => { log.info('server is running') }
start(onStart)

// Check out my blog for more resources!
// https://medium.com/@patrickleet
//
// Related Articles:
// https://hackernoon.com/what-makes-a-microservice-architecture-14c05ad24554
// https://codeburst.io/serverless-ish-a-scaling-story-5732945b93ab
//
