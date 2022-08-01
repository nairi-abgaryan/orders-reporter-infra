import { Module } from '@nestjs/common';
import { ProductReportService } from './product-report.service';
import { ProductReportController } from './product-report.controller';

@Module({
  controllers: [ProductReportController],
  providers: [ProductReportService],
  imports: [],
})
export class ReportsModule {}
