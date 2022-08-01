## Description
Product reporter is a part of the orders reporter distributed system.
This reader service is responsible for subscribing to the RabbitMQ message broker for receiving reported data from the orders analyser service. Data stored in Redis cache for instant response.
If Redis does not provide data, it requests to shared MongoDB.


## Datastores in use
Redis DB - Used for returning instant reports from cache

## Installation
Details described in this repo.

GitHub: https://github.com/nairi-abgaryan/orders-reporter-infra


## Environment variables

```bash

REDIS_URL=redis://:password123@127.0.0.1:6379/
DB_CONNECTION_URL=mongodb://localhost:27017/orders

```



## Testing APIs
http://localhost:3001/products/profit/top

http://localhost:3001/products/orders-count/top

http://localhost:3001/products/orders-count-from-yesterday/top
