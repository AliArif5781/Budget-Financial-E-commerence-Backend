import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPopularProductsDto } from './types/type';
import { User } from 'src/user/schema/user.schema';
import { Invoice } from 'src/invoice/schema/invoice.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    // @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      return await this.productModel.create({
        name: createProductDto.name,
        title: createProductDto.title,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        category: createProductDto.category,
        gender: createProductDto.gender,
        size: createProductDto.size,
        mediaType: createProductDto.mediaType,
        mediaUrl: createProductDto.mediaUrl,
        thumbnailUrl: createProductDto.thumbnailUrl,
      });
    } catch (error) {
      throw new Error('Failed to Upload Products');
    }
  }

  async popularProducts(
    // getPopularProductsDto: getPopularProductsDto,
    userId: string,
  ) {
    return await this.invoiceModel.aggregate([
      { $unwind: '$items' }, //$unwind turns array elements into separate documents
      {
        $group: {
          // $group groups documents by a field
          _id: '$items.productId',
          // Group by each product id
          totalSold: { $sum: '$items.quantity' },
          // For each product, add quantity to totalSold
        },
        // If productId is same → put them together → add quantity”
      },
      { $sort: { totalSold: -1 } },
      /**
       * Sort products by totalSold
       * -1 means highest to lowest
         So most sold products come first
       */
      { $limit: 4 },
      // Keep only the first 4 documents
      {
        $lookup: {
          // $lookup says: “Take this ID, find the related document in another collection, and attach it here.”
          // right now you only have: productId, but frontend neeed name, price , e.t.c. It act like populate.
          // $lookup joins data from another collection
          from: 'products',
          // join with Products collection
          // Look inside the products collection
          localField: '_id',
          // current document’s productId, _id the productId in invoices
          foreignField: '_id',
          // product document’s id
          as: 'product',
          // Save the matched product inside a field named product
          // store matched product data inside product array
        },
        // $lookup creates an array product: [ {...} ]
      },
      { $unwind: '$product' },
      // why use again becoz lookup again gave us in array form.
      // $unwind converts it into a single object
      // So you can access product.name, product.price easily.
      {
        $project: {
          // $project selects fields you want in final result
          _id: 0,
          // remove MongoDB default id
          productId: '$product',
          // productId: '$_id' → rename _id to productId
          totalSold: 1,
          // totalSold: 1 → keep totalSold
          // name: '$product.name',
          // price: '$product.price',
          // image: '$product.image',
          // name, price, image → take from product document
        },
      },
    ]);
  }

  async findAllProductsData() {
    const products = await this.productModel.find();

    return {
      products,
    };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException('Product not Found');
    return product;
  }

  async getAllProductCount() {
    return await this.productModel.estimatedDocumentCount();
  }

  // get chart data
  async chartData() {
    return await this.invoiceModel
      .find({}, { total: 1, createdAt: 1, _id: 0 })
      .lean();
  }
  async getAllProducts(limit: number, cursor?: string) {
    const query: any = {};

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const products = await this.productModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasNextPage = products.length > limit;

    if (hasNextPage) {
      products.pop(); // remove extra item
    }

    const nextCursor =
      products.length > 0 ? products[products.length - 1]._id : null;

    return {
      data: products,
      nextCursor,
      hasNextPage,
    };
  }
}
