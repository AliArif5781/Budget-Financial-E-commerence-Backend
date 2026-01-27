import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schema/payment.schema';
import { Model, Types } from 'mongoose';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { Product } from 'src/products/schema/product.schema';
import { Invoice } from 'src/invoice/schema/invoice.schema';

@Injectable()
// Find the product whose ID matches the one in the cart.
// ensure enough stock, stock must be greater than or equal to item.quantity.
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}
  // store user payment
  async createPaymentAndInvoice(dto: CreatePaymentDto, userId: string) {
    // 1. Validate stock (your existing logic)
    for (const item of dto.items) {
      const product = await this.productModel.findById(item.productId);
      if (!product) throw new Error('Product not found');
      if (product.stock < item.quantity) throw new Error('Insufficient stock');
    }

    // 2. Update stock (existing logic)
    for (const item of dto.items) {
      await this.productModel.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
    }

    // 3. Create payment (SUCCESS)
    const payment = await this.paymentModel.findOneAndUpdate(
      { token: dto.token },
      {
        $setOnInsert: {
          amount: dto.amount,
          currency: dto.currency,
          environment: dto.environment,
          mode: dto.mode,
          payment_method_kind: dto.payment_method_kind,
          items: dto.items,
          token: dto.token,
          user: userId,
          // status: 'SUCCESS',
        },
      },
      { upsert: true, new: true },
    );

    // 4. Create invoice (idempotent)
    const invoice = await this.invoiceModel.findOneAndUpdate(
      { token: dto.token },
      {
        $setOnInsert: {
          token: dto.token,
          user: userId,
          items: dto.items,
          mode: dto.mode,
          environment: dto.environment,
          payment_method_kind: dto.payment_method_kind,
          payment_Method: dto.payment_method_kind,
          total: dto.amount,
          currenct: dto.currency,
        },
      },
      { upsert: true, new: true },
    );

    return { payment, invoice };
  }

  // get user payment details
  async getUserPaymentDetails(userId: string) {
    return await this.paymentModel
      .findOne({
        user: userId,
      })
      .populate('user', 'firstName lastName email address phone')
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'name price',
      });
  }

  // get revenue price data

  async revenue(adminId: string) {
    const check = await this.paymentModel.find({ user: adminId });

    if (!check)
      throw new ForbiddenException('You dont have permission to access');

    const revenue = await this.paymentModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: `$amount` },
        },
      },
    ]);

    return {
      total: revenue[0]?.totalAmount || 0,
    };
  }
}
