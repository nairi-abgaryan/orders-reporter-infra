import { Order } from '../../modules/orders/schemas/order.schema';
import { ProductWithQuantity } from '../../modules/interfaces';

export class MapReduceProducts {
  constructor(private orders: Order[]) {}

  async products() {
    const products = new Map();
    const productIds = new Set();

    this.orders.forEach((order: Order) => {
      order.items.forEach((product: ProductWithQuantity) => {
        const currentTotalPrice = product.product.price * product.quantity;
        productIds.add(product.product.id);

        if (products.has(product.product.id)) {
          products.set(product.product.id, {
            profit: products.get(product.product.id).profit + currentTotalPrice,
            ordersCount: products.get(product.product.id).ordersCount + 1,
          });
        } else {
          products.set(product.product.id, {
            profit: currentTotalPrice,
            ordersCount: 1,
          });
        }
      });
    });

    try {
      const ids = Array.from(productIds);

      return {
        products,
        ids,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
