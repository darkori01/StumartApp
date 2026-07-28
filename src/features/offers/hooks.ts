import { useState, useCallback } from 'react';
import { Offer, OfferStatus } from './types';

// Mock state for the entire app since this is a frontend-only demo
const mockOffersState: Record<string, Offer[]> = {};

export function useOffers(listingId: string) {
  const [offers, setOffers] = useState<Offer[]>(mockOffersState[listingId] || []);

  const refresh = useCallback(() => {
    setOffers(mockOffersState[listingId] || []);
  }, [listingId]);

  return { offers, refresh };
}

export function useOfferActions() {
  const submitOffer = useCallback((offer: Offer) => {
    if (!mockOffersState[offer.listingId]) {
      mockOffersState[offer.listingId] = [];
    }
    mockOffersState[offer.listingId].push(offer);
    return Promise.resolve(offer);
  }, []);

  const updateOfferStatus = useCallback((offerId: string, listingId: string, status: OfferStatus) => {
    const list = mockOffersState[listingId];
    if (list) {
      const idx = list.findIndex(o => o.id === offerId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], status };
      }
    }
    return Promise.resolve();
  }, []);

  const counterOffer = useCallback((previousOffer: Offer, newOfferAmount: number) => {
    // Decline previous
    updateOfferStatus(previousOffer.id, previousOffer.listingId, 'COUNTERED');
    
    // Create new
    const newOffer: Offer = {
      id: Math.random().toString(36).substring(7),
      listingId: previousOffer.listingId,
      threadId: previousOffer.threadId,
      senderId: 'me',
      listingAmount: previousOffer.listingAmount,
      offerAmount: newOfferAmount,
      quantity: previousOffer.quantity,
      round: previousOffer.round + 1,
      status: 'PENDING',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    return submitOffer(newOffer);
  }, [submitOffer, updateOfferStatus]);

  return { submitOffer, updateOfferStatus, counterOffer };
}
