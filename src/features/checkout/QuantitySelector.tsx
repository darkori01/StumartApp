import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuantitySelectorProps {
  quantity: number;
  maxStock: number;
  unitPrice: number;
  originalUnitPrice?: number;
  isNegotiated?: boolean;
  onQuantityChange: (newQty: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxStock,
  unitPrice,
  originalUnitPrice,
  isNegotiated,
  onQuantityChange,
}) => {
  const isMin = quantity <= 1;
  const isMax = quantity >= maxStock;

  const handleDecrement = () => {
    if (!isMin) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (!isMax) {
      onQuantityChange(quantity + 1);
    }
  };

  const subtotal = (unitPrice * quantity).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.unitPriceText}>GHS {unitPrice.toFixed(2)} / item</Text>
          {isNegotiated && originalUnitPrice && originalUnitPrice > unitPrice && (
            <View style={styles.negotiatedBadge}>
              <Ionicons name="pricetag" size={12} color="#F59E0B" />
              <Text style={styles.negotiatedBadgeText}>
                Negotiated (listed GHS {originalUnitPrice.toFixed(2)})
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.stockBadge}>
          {maxStock > 0 ? `${maxStock} in stock` : 'Out of stock'}
        </Text>
      </View>

      <View style={styles.stepperRow}>
        <Text style={styles.label}>Quantity</Text>
        <View style={styles.stepperContainer}>
          <Pressable
            style={[styles.stepperBtn, isMin && styles.stepperBtnDisabled]}
            onPress={handleDecrement}
            disabled={isMin}
          >
            <Ionicons name="remove" size={18} color={isMin ? '#9CA3AF' : '#4F46E5'} />
          </Pressable>

          <View style={styles.qtyDisplay}>
            <Text style={styles.qtyText}>{quantity}</Text>
          </View>

          <Pressable
            style={[styles.stepperBtn, isMax && styles.stepperBtnDisabled]}
            onPress={handleIncrement}
            disabled={isMax}
          >
            <Ionicons name="add" size={18} color={isMax ? '#9CA3AF' : '#4F46E5'} />
          </Pressable>
        </View>
      </View>

      <View style={styles.subtotalRow}>
        <Text style={styles.subtotalLabel}>Item Subtotal</Text>
        <Text style={styles.subtotalValue}>GHS {subtotal}</Text>
      </View>
      {isMax && (
        <Text style={styles.stockWarning}>
          Maximum stock available for this item ({maxStock}) reached.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flex: 1,
  },
  unitPriceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  negotiatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
    gap: 4,
  },
  negotiatedBadgeText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600',
  },
  stockBadge: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  stepperBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  qtyDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#CBD5E1',
    minWidth: 40,
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  subtotalLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  subtotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4F46E5',
  },
  stockWarning: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
});
