import { Offer } from '../offers/types';

export type PaymentType = 'card' | 'mobile_money' | 'paystack' | 'wallet';

export interface OrderItem {
  productId: string;
  title: string;
  imageUrl: string | any;
  quantity: number;
  unitPrice: number;
  originalUnitPrice?: number;
  lineTotal: number;
  isNegotiated?: boolean;
  offerId?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentType;
  paymentDetailsMasked: string;
  paymentStatus: 'pending' | 'verified' | 'failed';
  offerId?: string | null;
  orderStatus: 'Processing' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
  isUnseenBySeller?: boolean;
}

export interface CheckoutTarget {
  listing: {
    id: string;
    vendorId?: string;
    title: string;
    vendor: string;
    price: string;
    priceType: 'Fixed' | 'Negotiable';
    image: any;
    description: string;
    category?: string;
    stock?: number;
  };
  price: string;
  unitPriceNum: number;
  originalPriceNum?: number;
  offer?: Offer;
  initialQuantity?: number;
}
