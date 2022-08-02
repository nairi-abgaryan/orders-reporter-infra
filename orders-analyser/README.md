
## Introduction
_Orders analyser_ is a part of the reporter distributed system.
The service is responsible for getting data from orders API
using this URL.
https://recruitment-api.dev.flipfit.io/orders?_page=1&_limit=1

After receiving and analysing data, if the top 10 ordered products </br>
are different from previous ones, the service triggers an MQ Event about that change!


After receiving and analysing data, If the top 10 profitable products </br>
are different from previous ones, the service triggers an MQ Event about that change!


After receiving and analysing data, If the top 10 top ordered products </br>
are different from previous ones from yesterday, the service triggers an MQ Event about that change!
<br>_**important note_**
Each time system computes and triggers MQ event about data from yesterday. <br>
In case of changing requirements for a dynamic date, the
solution will not work.  
For that case, each request from the client will need to connect to DB to count results.

## Datastores in use
MongoDb - Used as a persistent database to keep normalized data to provide statistics

## Environment variables

```bash
DB_CONNECTION_URL=mongodb://localhost:27017/orders
MQ_URL=amqp://localhost:5672

```
## DB Schemas
```js
// Schema for orders history. 
// The Order schema is used for getting the top profitable products by date(yesterday)
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

**Indeed there are a lot of other architectural solutions to this problem **
Depends on what type of problem we need to solve in the future the architecture can be changed
