import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import mongoose, { Model, Types } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async addToCart(createCartDto: CreateCartDto, userId: string) {
    // check if userID with productid exist in cartModel, if have then oonly increase the quantity.
    // check if not then create it userId and productID
    for (const item of createCartDto.items) {
      const updated = await this.cartModel.findOneAndUpdate(
        {
          userId,
          'items.productId': item.productId,
        },
        {
          $inc: { 'items.$.quantity': item.quantity },
        },
        { new: true },
      );
      if (!updated) {
        await this.cartModel.findOneAndUpdate(
          { userId },
          {
            $push: {
              items: { productId: item.productId, quantity: item.quantity },
            },
          },
          { upsert: true, new: true },
        );
      }
    }
    return this.cartModel.findOne({ userId });
  }

  // get add to cart item
  async getCartItem(userId: string) {
    try {
      const cart = await this.cartModel
        .findOne({ userId })
        .populate('items.productId')
        .lean();

      if (!cart?.items?.length) return [];

      const flat = cart.items
        .filter((i) => i.productId)
        .map((i) => {
          const p = i.productId as any;
          return {
            _id: String(p._id),
            name: p.name,
            title: p.title,
            description: p.description,
            price: p.price,
            stock: p.stock,
            category: p.category,
            size: p.size,
            mediaUrl: p.mediaUrl,
            thumbnailUrl: p.thumbnailUrl,
            mediaType: p.mediaType,
            gender: p.gender,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            quantity: i.quantity,
          };
        });

      return flat;
    } catch (error) {
      throw error ?? new Error('Failed to get Cart Items.');
    }
  }

  // delete item from cart

  // cart.service.ts

  async deleteCartItem(userId: string, productId: string) {
    try {
      // Pull item from items array by productId (ObjectId)
      const updated = await this.cartModel
        .findOneAndUpdate(
          { userId },
          { $pull: { items: { productId: new Types.ObjectId(productId) } } },
          { new: true }, // return updated doc
        )
        .populate('items.productId')
        .lean();

      if (!updated) {
        throw new NotFoundException('Cart not found');
      }

      
      const flat = (updated.items ?? [])
        .filter((i) => i.productId)
        .map((i: any) => ({
          _id: String(i.productId._id),
          name: i.productId.name,
          title: i.productId.title,
          description: i.productId.description,
          price: i.productId.price,
          stock: i.productId.stock,
          category: i.productId.category,
          size: i.productId.size,
          mediaUrl: i.productId.mediaUrl,
          thumbnailUrl: i.productId.thumbnailUrl,
          mediaType: i.productId.mediaType,
          gender: i.productId.gender,
          createdAt: i.productId.createdAt,
          updatedAt: i.productId.updatedAt,
          quantity: i.quantity,
        }));

      return flat; // <- frontend can set this directly into state.cartItems
    } catch (error) {
      throw error ?? new Error('Failed to delete product.');
    }
  }

  async updateCartQuantity(userId: string, dto: UpdateCartDto) {
    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(dto.productId);

    // Find cart
    const cart = await this.cartModel.findOne({ userId: userObjectId });
    if (!cart) throw new NotFoundException('Cart not found');

    // Find product in cart
    const item = cart.items.find(
      (i) => i.productId.toString() === dto.productId,
    );
    if (!item) throw new NotFoundException('Product not in cart');

    // Update quantity
    item.quantity += dto.quantity;

    // Remove if quantity <= 0
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== dto.productId,
      );
    }

    // Save and populate product details for frontend
    const updatedCart = await cart.save();
    await updatedCart.populate('items.productId');

    // Flatten for frontend
    return updatedCart.items.map((i: any) => {
      const p = i.productId;
      return {
        _id: p._id.toString(),
        name: p.name,
        title: p.title,
        description: p.description,
        price: p.price,
        stock: p.stock,
        category: p.category,
        size: p.size,
        mediaUrl: p.mediaUrl,
        thumbnailUrl: p.thumbnailUrl,
        mediaType: p.mediaType,
        gender: p.gender,
        quantity: i.quantity,
      };
    });
  }

  async selectedProductItem(id: string) {
    return await this.productModel.findById({ _id: id });
  }
}

/*
        $addToSet:
Adds items to an array only if they are not already there (prevents duplicates).


        upsert: true:
If no cart is found for this user, create a new cart document automatically with the update applied.

        new: true:
Return the updated cart after changes (instead of the old version).
         */
