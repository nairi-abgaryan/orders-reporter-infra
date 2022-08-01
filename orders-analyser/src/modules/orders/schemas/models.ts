import { ProductReport, ProductReportSchema } from './product-report.schema';
import { Order, OrderSchema } from './order.schema';
import { Pagination, PaginationSchema } from './pagination.schema';

export const models = [
  {
    name: Order.name,
    schema: OrderSchema,
  },
  {
    name: ProductReport.name,
    schema: ProductReportSchema,
  },
  {
    name: Pagination.name,
    schema: PaginationSchema,
  },
];
