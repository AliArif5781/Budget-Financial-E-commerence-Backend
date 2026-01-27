import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import { Invoice, InvoiceSchmea } from 'src/invoice/schema/invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchmea }]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
