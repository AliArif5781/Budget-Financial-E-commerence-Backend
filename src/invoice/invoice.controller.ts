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
import { InvoiceService } from './invoice.service';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { RolesGuard } from 'src/user/role.guard';
import { Roles } from 'src/user/role.decrorator';
import { Role } from 'src/user/types/user.type';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  // @Post('saveInvoice')
  // @UseGuards(AuthGuard)
  // @SkipThrottle()
  // create(@Body() dto: CreateInvoiceDto, @Req() req) {
  //   const userId = req.user.sub;
  //   return this.invoiceService.create(dto, userId);
  // }

  @Get('my-invoice')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  findOgetMyInvoicesne(@Req() req) {
    const userId = req.user.sub;
    return this.invoiceService.getMyInvoices(userId);
  }

  @Get('getAllInvoice')
  @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  @SkipThrottle()
  getAllInvoice() {
    return this.invoiceService.findAll();
  }

  @Get('getAllValue')
  @SkipThrottle()
  async valueInvoice() {
    return await this.invoiceService.getTotalAmountInvoice();
  }
}
