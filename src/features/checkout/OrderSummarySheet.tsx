import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CheckoutTarget } from './types';
import { QuantitySelector } from './QuantitySelector';

interface OrderSummarySheetProps {
  checkoutTarget: CheckoutTarget;
  quantity: number;
  maxStock: number;
  serviceFee: number;
  deliveryFee: number;
  onQuantityChange: (qty: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const OrderSummarySheet: React.FC<OrderSummarySheetProps> = ({
  checkoutTarget,
  quantity,
  maxStock,
  serviceFee,
  deliveryFee,
  onQuantityChange,
  onConfirm,
  onBack,
}) => {
  const { listing, unitPriceNum, originalPriceNum, offer } = checkoutTarget;
  const isNegotiated = !!offer || !!(originalPriceNum && originalPriceNum > unitPriceNum);

  const subtotal = unitPriceNum * quantity;
  const grandTotal = subtotal + serviceFee + (deliveryFee || 0);

  const isStockExceeded = quantity > maxStock;

  return (
    <View style={styles.sheetContainer}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#4F46E5" />
        </Pressable>
        <Text style={styles.headerTitle}>Order Summary & Receipt</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sellerBanner}>
          <Ionicons name="storefront-outline" size={16} color="#4F46E5" />
          <Text style={styles.sellerText}>Seller: {listing.vendor}</Text>
        </View>

        {/* Itemized Card */}
        <View style={styles.itemCard}>
          <Image
            source={typeof listing.image === 'string' ? { uri: listing.image } : listing.image}
            style={styles.itemImage}
            resizeMode="cover"
          />
          <View style={styles.itemDetails}>
            <Text style={styles.itemTitle}>{listing.title}</Text>

            {isNegotiated && (
              <View style={styles.negotiatedBadge}>
                <Ionicons name="pricetag" size={12} color="#F59E0B" />
                <Text style={styles.negotiatedBadgeText}>
                  Negotiated price: GHS {unitPriceNum.toFixed(2)}
                  {originalPriceNum ? ` (listed GHS ${originalPriceNum.toFixed(2)})` : ''}
                </Text>
              </View>
            )}

            <View style={styles.itemPriceRow}>
              <Text style={styles.unitPrice}>GHS {unitPriceNum.toFixed(2)} ea</Text>
              <Text style={styles.lineTotal}>GHS {subtotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Quantity Stepper */}
        <QuantitySelector
          quantity={quantity}
          maxStock={maxStock}
          unitPrice={unitPriceNum}
          originalUnitPrice={originalPriceNum}
          isNegotiated={isNegotiated}
          onQuantityChange={onQuantityChange}
        />

        {/* Fees Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Price Breakdown</Text>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'})</Text>
            <Text style={styles.breakdownValue}>GHS {subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.feeLabelWithInfo}>
              <Text style={styles.breakdownLabel}>Campus Service Fee</Text>
              <Text style={styles.mockTag}>Fixed</Text>
            </View>
            <Text style={styles.breakdownValue}>GHS {serviceFee.toFixed(2)}</Text>
          </View>

          {deliveryFee > 0 && (
            <View style={styles.breakdownRow}>
              <View style={styles.feeLabelWithInfo}>
                <Text style={styles.breakdownLabel}>Hostel Delivery Fee</Text>
                <Text style={styles.mockTag}>Fixed</Text>
              </View>
              <Text style={styles.breakdownValue}>GHS {deliveryFee.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>GHS {grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.guaranteeBox}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#10B981" />
          <Text style={styles.guaranteeText}>
            StuMart Buyer Protection: Funds held safely until service is rendered or item received.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.confirmBtn, isStockExceeded && styles.disabledBtn]}
          onPress={onConfirm}
          disabled={isStockExceeded}
        >
          <Text style={styles.confirmBtnText}>Confirm & Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>

        <Pressable style={styles.backCartBtn} onPress={onBack}>
          <Text style={styles.backCartText}>Back to cart</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  sellerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  sellerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    gap: 12,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  negotiatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 4,
  },
  negotiatedBadgeText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '700',
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  unitPrice: {
    fontSize: 13,
    color: '#64748B',
  },
  lineTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  breakdownCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
    marginBottom: 12,
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  feeLabelWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mockTag: {
    fontSize: 10,
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 19,
    fontWeight: '900',
    color: '#4F46E5',
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  guaranteeText: {
    flex: 1,
    fontSize: 12,
    color: '#065F46',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  confirmBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  disabledBtn: {
    backgroundColor: '#9CA3AF',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  backCartBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  backCartText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
