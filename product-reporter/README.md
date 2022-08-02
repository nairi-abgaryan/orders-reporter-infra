## Description
__Product-reporter__ is a part of the reporter distributed system.
This reader service is subscribed to the RabbitMQ message broker
for receiving reported data from the orders-analyser service. 
The data is stored in a Redis cache for instant response. 
If Redis does not provide data,  the service gets it from the Mongo database.

## Datastores in use
Redis DB - Used for returning instant reports from cache

## Installation
Details described in this repo.

GitHub: https://github.com/nairi-abgaryan/orders-reporter-infra

## Environment variables

```bash

REDIS_URL=redis://:password123@127.0.0.1:6379/
DB_CONNECTION_URL=mongodb://localhost:27017/orders
MQ_URL=amqp://localhost:5672

```

## Testing APIs
http://localhost:3001/products/profit/top

http://localhost:3001/products/orders-count/top

http://localhost:3001/products/orders-count-from-yesterday/top
