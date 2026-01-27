export enum category {
  Electronic = 'Electronic',
  Grocery = 'Grocery',
  Fashion = 'Fashion',
  Cosmetics = 'Cosmetics',
}

export enum gender {
  men = 'men',
  women = 'women',
  baby = 'baby',
  unisex = 'unisex',
}

export enum size {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
  standard = 'standard',
}

export enum MediaType {
  image = 'image',
}

export interface getPopularProductsDto {
  id: string; // productId
  title: string;
  price: number; // per unit
  image?: string;
  quantity: number; // >= 1
}
