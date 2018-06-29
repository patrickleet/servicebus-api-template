# api-template

This is an example of a command API service.

This API exposes an HTTP endpoint that ingests HTTP requests into a `command` that our system understands. 

It's kinda like a translator, or a hand signer.

It translates HTTP to the language of our microservices: messages.

To see an example of a "Model Service" check out: https://github.com/patrickleet/servicebus-microservice

More info:
https://hackernoon.com/learning-these-5-microservice-patterns-will-make-you-a-better-engineer-52fc779c470a

## Explore the Code

`./bin/start.mjs`
* Starts the application:
  1. Configures a bus
  1. Configures an API server
  1. Starts the API server

`./routes/*`
* Your API's routes
  * `res.bus` is available to send messages

`./config.mjs`
* Using `cconfig` for configuration
  * A "cascading configuration" tool
  * env variables are applied on top of default config
  * can configure environment specific configs as well

That's it! The rest is tooling.

```
helm install --namespace servicebus stable/rabbitmq
helm install --namespace servicebus stable/redis
```
