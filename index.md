```javascript
  @Get('allProductscursor')
  @SkipThrottle()
  async allProducts(
    @Query('limit') limit = 5,
    @Query('cursor') cursor: string,
  ) {
    return await this.productsService.getAllProducts(Number(limit), cursor);
  }
```

```javascript
async getAllProducts(limit: number, cursor?: string) {
    // const check = await this.userModel.findById({ userId });
    // if (!check) throw new NotFoundException('User didnot found');
    // const product = await this.productModel.findById(id).lean();
    // if (!product) throw new NotFoundException('Product not Found');
    // return product;

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
```

```javascript
let user see product
 ["A100","A99","A98","A97","A96"];

//  so after "A96" products they back to another page or close the tab and after sometime they came and open to see products. So the last id of products "A96" _id store in cursor and they gave us data which post before the "A5" products. We can do this by last seen productId.


// After
 ["A95","A94","A93","A92","A91"];



```

```javascript
 {hasNextPage && <div ref={loadMoreRef} className="h-10" />}

      {moreCursorLoading && (
        <div className="flex justify-center py-6">
          <span>Loading...</span>
        </div>
      }
```
