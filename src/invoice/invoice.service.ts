import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './schema/invoice.schema';
import { Model } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  // async create(dto: CreateInvoiceDto, userId: string) {
  //   const invoice = await this.invoiceModel.findOneAndUpdate(
  //     { token: dto.token },
  //     {
  //       $setOnInsert: {
  //         mode: dto.mode,
  //         bank: dto.bank,
  //         payment_Method: dto.payment_Method,
  //         total: dto.total,
  //         items: dto.items,
  //         user: userId,
  //         token: dto.token,
  //       },
  //     },
  //     {
  //       upsert: true,
  //       new: true,
  //     },
  //   );
  //   return invoice;
  // }

  async findAll() {
    return await this.invoiceModel
      .find()
      .populate({
        path: 'items.productId',
        select: 'name price',
      })
      .populate('user', 'firstName')
      .lean();
  }

  async getMyInvoices(userId: string) {
    const invoice = await this.invoiceModel
      .find({ user: userId })
      .populate('items.productId');
    return invoice;
  }

  async getTotalAmountInvoice() {
    const invoices = await this.invoiceModel.find().lean();

    return invoices.reduce((sum, invoice) => {
      return sum + Number(invoice.total);
    }, 0);
  }
}
