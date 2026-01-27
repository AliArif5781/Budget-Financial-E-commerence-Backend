import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { SkipThrottle } from '@nestjs/throttler';
import axios from 'axios';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/user/role.guard';
import { Roles } from 'src/user/role.decrorator';
import { Role } from 'src/user/types/user.type';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // payment token
  @Post('token')
  @SkipThrottle()
  async createToken(@Body() body: { amount: number }) {
    return {
      token: 'sanobx_dummy_token_for_handling_payment_frontend_and_backend',
    };
  }

  // handle Payment
  @Post('')
  @SkipThrottle()
  async processPayment(@Body() body: { token: string; amount: number }) {
    const { token, amount } = body;

    const safeAmount = Math.round(amount);
    try {
      const response = await axios.post(
        `${process.env.SAFEPAY_BASE_URL}/order/payments/v3/`,
        {
          token,
          amount: safeAmount,
          currency: 'USD',
          merchant_api_key: process.env.SAFEPAY_MERCHANT_KEY,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SAFEPAY_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        payment: response.data,
        message: 'Payment Accepted Successfully.',
      };
    } catch (error) {
      console.warn(
        'SafePay Axios error:',
        error.response?.status,
        error.message,
      );

      return {
        success: false,
        message: 'Unable to initiate payment',
      };
    }
  }

  // store payment details
  @Post('storePayment')
  @UseGuards(AuthGuard)
  async storePayment(@Body() CreatePaymentDto: CreatePaymentDto, @Req() req) {
    const userId = req.user.sub;
    return await this.paymentsService.createPaymentAndInvoice(
      CreatePaymentDto,
      userId,
    );
  }

  // get user payment details
  @Get('getUserPaymentDetails')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  async userPaymentDetails(@Req() req) {
    const userId = req.user.sub;
    return await this.paymentsService.getUserPaymentDetails(userId);
  }

  @Get('getAllRevenue')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @SkipThrottle()
  async getRevenue(@Req() req) {
    const adminId = req.user.sub;
    return await this.paymentsService.revenue(adminId);
  }
}
