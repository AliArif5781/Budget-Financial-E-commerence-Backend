import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import { Invoice, InvoiceSchmea } from 'src/invoice/schema/invoice.schema';
import { CartModule } from 'src/cart/cart.module';
import { Cart, CartSchema } from 'src/cart/schema/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchmea }]),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
