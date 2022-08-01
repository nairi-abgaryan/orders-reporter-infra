
## Introduction
Orders analyser is a part of reporter distributed system.
The service is responsible for getting data from orders API
using this URL.
https://recruitment-api.dev.flipfit.io/orders?_page=1&_limit=1
Then after analysing data, it saves it in the data in the MongoDB database.

After analysis, if the top 10 ordered and the top 10 profitable products
differentiate from previous ones, the service triggers an event about that change.
## Architecture Diagrams 

![docs/d.png](docs/d.png)


## Datastores in use
MongoDb - Used as a persistent database to keep normalized data to provide statistics

## Environment variables

```bash

REDIS_URL=redis://:password123@127.0.0.1:6380/
DB_CONNECTION_URL=mongodb://localhost:27017/orders

```
## DB Schemas
```js
// Schema for orders history. 
// We are using this schema for getting the top profitable products from yesterday, or if needed, from another date
export class Order {
	id: string; // product id
	date: Date; // Order date, indexed
	customer: Customer; // custome
	items: ProductWithQuantity[]; // Order products
}

// Schema for counting total product profit and orders count
export class ProductReport {
	id: string; // product id
	profit: number;    // The total profit from product - indexed
	ordersCount: number;  // total ordered product - indexed
}

// Schema for storing last request page data
class Pagination {
	lastPage: number;  // last time 
	lastItemsCount: number;
	limit: number;
}

```


**The system computes 100 orders products in each 5 second.**

Achieving final data results will take _20000/100*5_  seconds. 

After finishing the computation service will continue to do requests each second to keep data up to date.


Depends on what type of problem we need to solve in the future the architecture can be changed
**Indeed there are a lot of excellent architectures for this problem **
