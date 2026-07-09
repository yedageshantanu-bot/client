export type MediaAsset = {
  url: string;
  publicId?: string;
  order?: number;
  altText?: string;
  resourceType?: "image" | "video";
  thumbnailUrl?: string;
  format?: string;
  mimeType?: string;
};

export type ProductMedia = {
  frontImage?: MediaAsset | null;
  backImage?: MediaAsset | null;
  sideImage?: MediaAsset | null;
  hoverImage?: MediaAsset | null;
  thumbnail?: MediaAsset | null;
  sizeChart?: MediaAsset | null;
  galleryImages: MediaAsset[];
  videos: MediaAsset[];
};

export type ProductVariant = {
  _id?: string;
  colorName: string;
  colorCode: string;
  price: number;
  stock: number;
  frontImage?: MediaAsset | null;
  backImage?: MediaAsset | null;
  galleryImages: MediaAsset[];
  video?: MediaAsset | null;
  sku?: string;
};

export type Product = {
  _id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  price: number;
  discountPrice: number;
  discount: number;
  category: string;
  subCategory?: string;
  fabric?: string;
  occasion?: string;
  color?: string;
  images?: Array<string | MediaAsset>;
  mainImage?: string | MediaAsset | null;
  video?: string | MediaAsset | null;
  media?: ProductMedia;
  thumbnail?: MediaAsset | null;
  galleryImages?: MediaAsset[];
  videos?: MediaAsset[];
  variants?: ProductVariant[];
  selectedVariant?: ProductVariant | null;
  stock: number;
  description: string;
  descriptionSections?: string;
  declaration?: string;
  shippingReturns?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  featured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  createdBy?: string;
  ratings?: {
    average: number;
    count: number;
  };
  rating?: number;
  reviews: number | Review[];
  isNew?: boolean;
  isBestSeller?: boolean;
};

export type Coupon = {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  discount: number;
  maxDiscount?: number | null;
  maxUses: number | null;
  usedCount: number;
  expiryDate: string | null;
  isActive: boolean;
  minimumOrder: number;
  applicableProducts: string[];
  oneUsePerUser: boolean;
  usedBy: string[];
};

export type CartItem = {
  _id: string;
  title: string;
  price: number;
  discountPrice: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
};

export type AppliedCoupon = {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  discount: number;
  amount: number;
};

export type OrderProduct = {
  productId: string;
  title: string;
  image: string | MediaAsset;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

export type Address = {
  _id?: string;
  label?: string;
  fullName: string;
  phone: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
};

export type Order = {
  _id: string;
  orderId: string;
  userEmail: string;
  customer: string;
  phone: string;
  products: OrderProduct[];
  shippingAddress: Address;
  subtotal: number;
  couponCode?: string;
  couponDiscount: number;
  total: number;
  paymentMethod: "Razorpay";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  deliveryStatus: "Pending" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Customer = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpending: number;
  lastOrder: string;
};

export type Review = {
  _id: string;
  productId: string;
  name: string;
  email?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
};

export type User = {
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  profileImage?: string;
  googleId?: string;
  role?: "customer" | "admin";
  phone?: string;
  wishlist?: Array<string | Product>;
  createdAt?: string;
  updatedAt?: string;
  addresses?: Array<{
    _id?: string;
    label?: string;
    fullName: string;
    phone: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }>;
};
