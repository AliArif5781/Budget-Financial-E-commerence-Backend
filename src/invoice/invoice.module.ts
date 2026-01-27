import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchmea } from './schema/invoice.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchmea }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
