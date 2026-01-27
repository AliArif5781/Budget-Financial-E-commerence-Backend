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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // add To Cart products
  @Post('products')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  async create(@Body() createCartDto: CreateCartDto, @Req() req) {
    const userId = req.user.sub;
    console.log(userId);
    return await this.cartService.addToCart(createCartDto, userId);
  }

  @Get('getCartProducts')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  async getItems(@Req() req) {
    const userId = req.user.sub;
    return await this.cartService.getCartItem(userId);
  }

  @Patch('updateQuantity')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  async updateQuantity(@Body() dto: UpdateCartDto, @Req() req) {
    const userId = req.user.sub;
    return this.cartService.updateCartQuantity(userId, dto);
  }

  @Delete(':productId')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  async itemDelete(@Param('productId') productId: string, @Req() req) {
    const userId = req.user.sub;
    return await this.cartService.deleteCartItem(userId, productId);
  }

  @Get('selectedProduct/:id')
  @SkipThrottle()
  async selectedProduct(@Param('id') id: string) {
    return await this.cartService.selectedProductItem(id);
  }
}
