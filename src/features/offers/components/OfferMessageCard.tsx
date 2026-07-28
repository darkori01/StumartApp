import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Offer } from '../types';

interface OfferMessageCardProps {
  offer: Offer;
  isCurrentUserRecipient: boolean;
  onAccept: () => void;
  onCounter: () => void;
  onDecline: () => void;
  onCheckout: () => void;
  previousOfferAmount?: number; // for chained visual
}

const getStatusBadgeStyle = (status: string) => ({
  fontSize: 10,
  fontWeight: '700' as const,
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 4,
  backgroundColor:
    status === 'ACCEPTED' ? '#D1FAE5' :
    status === 'DECLINED' ? '#FEE2E2' :
    status === 'COUNTERED' ? '#F3F4F6' :
    '#FEF3C7',
  color:
    status === 'ACCEPTED' ? '#059669' :
    status === 'DECLINED' ? '#DC2626' :
    status === 'COUNTERED' ? '#4B5563' :
    '#D97706',
  overflow: 'hidden' as const,
});

export const OfferMessageCard: React.FC<OfferMessageCardProps> = ({
  offer,
  isCurrentUserRecipient,
  onAccept,
  onCounter,
  onDecline,
  onCheckout,
  previousOfferAmount,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const safeOffer = offer ?? {
    id: 'fallback-offer',
    listingId: '',
    threadId: '',
    senderId: 'them',
    listingAmount: 0,
    offerAmount: 0,
    quantity: 1,
    round: 1,
    status: 'PENDING' as const,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };

  useEffect(() => {
    if (safeOffer.status !== 'PENDING') return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = safeOffer.expiresAt - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`Expires in ${hours}h ${mins}m`);
      }
    }, 1000);
    // Initial call
    const now = Date.now();
    const diff = safeOffer.expiresAt - now;
    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`Expires in ${hours}h ${mins}m`);
    } else {
      setTimeLeft('Expired');
    }
    return () => clearInterval(interval);
  }, [safeOffer.expiresAt, safeOffer.status]);

  const isAccepted = safeOffer.status === 'ACCEPTED';
  const isDeclined = safeOffer.status === 'DECLINED';
  const isExpired = safeOffer.status === 'EXPIRED';
  const isCountered = safeOffer.status === 'COUNTERED';

  const maxRoundsReached = safeOffer.round >= 3;

  return (
    <View style={[styles.card, safeOffer.senderId === 'me' ? styles.myCard : styles.theirCard]}>
      {previousOfferAmount && (
        <View style={styles.chain}>
          <Text style={styles.chainText}>
            Was GHS {previousOfferAmount} → Now GHS {safeOffer.offerAmount}
          </Text>
        </View>
      )}

      <View style={styles.header}>
        <Ionicons
          name="pricetag"
          size={16}
          color={isAccepted ? '#10B981' : isDeclined ? '#EF4444' : '#F59E0B'}
        />
        <Text style={styles.headerTitle}>
          {safeOffer.senderId === 'me' ? 'Your Offer' : 'Received Offer'}
        </Text>
        <Text style={getStatusBadgeStyle(safeOffer.status)}>{safeOffer.status}</Text>
      </View>

      <View style={styles.body}>
        <View>
          <Text style={styles.amountLabel}>Offer Amount</Text>
          <Text style={styles.amount}>GHS {safeOffer.offerAmount}</Text>
        </View>
        <View style={styles.qtyContainer}>
          <Text style={styles.qtyLabel}>Qty</Text>
          <Text style={styles.qty}>{safeOffer.quantity}</Text>
        </View>
      </View>

      {safeOffer.status === 'PENDING' && (
        <View style={styles.footerInfo}>
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text style={styles.expiry}>{timeLeft}</Text>
        </View>
      )}

      {isAccepted && (
        <Pressable style={styles.checkoutBtn} onPress={onCheckout}>
          <Text style={styles.checkoutBtnText}>Continue to checkout</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </Pressable>
      )}

      {isCurrentUserRecipient && safeOffer.status === 'PENDING' && (
        <View style={styles.actions}>
          <Pressable style={[styles.actionBtn, styles.declineBtn]} onPress={onDecline}>
            <Text style={styles.declineBtnText}>Decline</Text>
          </Pressable>

          {!maxRoundsReached ? (
            <Pressable style={[styles.actionBtn, styles.counterBtn]} onPress={onCounter}>
              <Text style={styles.counterBtnText}>Counter</Text>
            </Pressable>
          ) : (
            <Text style={styles.limitText}>Final round reached</Text>
          )}

          <Pressable style={[styles.actionBtn, styles.acceptBtn]} onPress={onAccept}>
            <Text style={styles.acceptBtnText}>Accept</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  myCard: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  theirCard: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  chain: {
    backgroundColor: '#FFFBEB',
    padding: 6,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  chainText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  amount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  qtyContainer: {
    alignItems: 'flex-end',
  },
  qtyLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  qty: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  expiry: {
    fontSize: 12,
    color: '#6B7280',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineBtn: {
    backgroundColor: '#FEE2E2',
  },
  declineBtnText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
  },
  counterBtn: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  counterBtnText: {
    color: '#D97706',
    fontWeight: '600',
    fontSize: 13,
  },
  acceptBtn: {
    backgroundColor: '#10B981',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  limitText: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    flex: 1,
  },
});
