import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from './types';

interface OrderConfirmationModalProps {
  order: Order;
  onViewOrder: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onViewOrder,
  onContinueShopping,
}) => {
  const item = order.items[0];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.orderSuccessTitle}>Order Placed Successfully!</Text>
          <Text style={styles.orderNumberText}>Order ID: {order.id}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#10B981" />
            <Text style={styles.verifiedBadgeText}>Payment Verified</Text>
          </View>
        </View>

        {/* Itemized Receipt */}
        <View style={styles.receiptCard}>
          <Text style={styles.receiptCardTitle}>Order Receipt</Text>

          <View style={styles.vendorRow}>
            <Ionicons name="storefront-outline" size={16} color="#4F46E5" />
            <Text style={styles.vendorText}>Seller: {order.sellerName}</Text>
          </View>

          {item && (
            <View style={styles.itemRow}>
              <Image
                source={typeof item.imageUrl === 'string' ? { uri: item.imageUrl } : item.imageUrl}
                style={styles.itemThumb}
                resizeMode="cover"
              />
              <View style={styles.itemMeta}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.isNegotiated && (
                  <View style={styles.negotiatedTag}>
                    <Ionicons name="pricetag" size={10} color="#F59E0B" />
                    <Text style={styles.negotiatedTagText}>
                      Negotiated Price (listed GHS {item.originalUnitPrice?.toFixed(2)})
                    </Text>
                  </View>
                )}
                <Text style={styles.itemQtyPrice}>
                  Qty: {item.quantity} × GHS {item.unitPrice.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.itemTotal}>GHS {item.lineTotal.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Payment info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Method</Text>
            <Text style={styles.infoValue}>{order.paymentDetailsMasked}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date & Time</Text>
            <Text style={styles.infoValue}>{order.createdAt}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Subtotal</Text>
            <Text style={styles.infoValue}>GHS {order.subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service Fee</Text>
            <Text style={styles.infoValue}>GHS {order.serviceFee.toFixed(2)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Delivery Fee</Text>
            <Text style={styles.infoValue}>GHS {order.deliveryFee.toFixed(2)}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: '#4F46E5' }]} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Charged</Text>
            <Text style={styles.totalValue}>GHS {order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Sync Notice */}
        <View style={styles.syncNotice}>
          <Ionicons name="notifications-outline" size={18} color="#4F46E5" />
          <Text style={styles.syncNoticeText}>
            Order sent to seller's dashboard queue ({order.sellerName}). Live tracking is now active.
          </Text>
        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.viewOrderBtn} onPress={onViewOrder}>
          <Ionicons name="receipt-outline" size={18} color="#FFFFFF" />
          <Text style={styles.viewOrderText}>View My Orders</Text>
        </Pressable>

        <Pressable style={styles.continueShoppingBtn} onPress={onContinueShopping}>
          <Text style={styles.continueShoppingText}>Back to Marketplace</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
  },
  successHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  orderSuccessTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  orderNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '700',
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  receiptCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  vendorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemThumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
  },
  itemMeta: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  negotiatedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 3,
    marginTop: 2,
  },
  negotiatedTagText: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '700',
  },
  itemQtyPrice: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4F46E5',
  },
  syncNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  syncNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#3730A3',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  viewOrderBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  viewOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  continueShoppingBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  continueShoppingText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
