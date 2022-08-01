export interface OrderInterface {
  id: string;
  date: Date;
  customer: Customer;
  items: ProductWithQuantity[];
}

export interface Customer {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface ProductWithQuantity {
  product: Product;
  quantity: number;
}
