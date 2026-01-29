import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import ImageKit from 'imagekit';
import { AuthGuard } from 'src/auth/auth.guard';
import type { getPopularProductsDto } from './types/type';
import { SkipThrottle } from '@nestjs/throttler';
import axios, { AxiosError } from 'axios';
import { RolesGuard } from 'src/user/role.guard';
import { Roles } from 'src/user/role.decrorator';
import { Role } from 'src/user/types/user.type';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('upload')
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return { message: 'Product Created Successfully', product };
  }

  @Get('')
  getAssest() {
    const assest = imagekit.getAuthenticationParameters();
    return assest;
  }

  // Change it into only popular products
  @Get('getProducts')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  findAll(
    // @Body() getPopularProductsDto: getPopularProductsDto,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.productsService.popularProducts(userId);
  }

  @SkipThrottle()
  @Get('all-products')
  async find() {
    return await this.productsService.findAllProductsData();
  }

  @UseGuards(AuthGuard)
  // @Roles(Role.Admin)
  @SkipThrottle()
  @Get('productscount')
  async getCountProducts() {
    return await this.productsService.getAllProductCount();
  }

  // All Products
  @Get('allProductscursor')
  @SkipThrottle()
  async allProducts(
    @Query('limit') limit = 5,
    @Query('cursor') cursor: string,
  ) {
    return await this.productsService.getAllProducts(Number(limit), cursor);
  }

  // chart data
  @Get('getChartData')
  @SkipThrottle()
  async getChartData() {
    return await this.productsService.chartData();
  }

  // Popular Products
  @Get(':id')
  @SkipThrottle()
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }
}
