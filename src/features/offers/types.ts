export type OfferStatus = 'PENDING' | 'COUNTERED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';

export interface Offer {
  id: string;
  listingId: string;
  threadId: string;
  senderId: string; // 'me' or 'them'
  listingAmount: number;
  offerAmount: number;
  quantity: number;
  round: number; // Max 3 rounds as per requirements
  status: OfferStatus;
  expiresAt: number; // timestamp
}

export interface BargainOffer {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  offerAmount: number;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
  respondedAt?: string;
}

