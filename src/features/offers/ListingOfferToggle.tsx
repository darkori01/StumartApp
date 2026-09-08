import React from 'react';
import { View, Text, Switch, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  brand: '#4F46E5',
  brandSoft: '#7C3AED',
  text: '#1F2937',
  textLight: '#6B7280',
};

type ListingOfferToggleProps = {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  listingPriceNum?: number;
};

export const ListingOfferToggle: React.FC<ListingOfferToggleProps> = ({
  enabled,
  onToggle,
  listingPriceNum = 0,
}) => {
  const bargainPrice = Math.round(listingPriceNum * 0.9);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="pricetag-outline" size={20} color={COLORS.brand} />
          <Text style={styles.title}>Negotiable Listing</Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#E2E8F0', true: COLORS.brandSoft }}
          thumbColor={enabled ? COLORS.brand : '#f4f3f4'}
        />
      </View>
      <Text style={styles.description}>
        Allow buyers to make pre-approved offers on this item.
      </Text>

      {enabled && (
        <View style={styles.calcBox}>
          <View style={styles.calcRow}>
            <Ionicons name="calculator-outline" size={16} color="#4F46E5" />
            <Text style={styles.calcText}>
              Actual price: ₵{listingPriceNum} → Lowest offer buyers can send: ₵{bargainPrice}
            </Text>
          </View>
          <View style={styles.infoNote}>
            <Ionicons name="information-circle-outline" size={14} color="#D97706" />
            <Text style={styles.infoNoteText}>
              Buyers will be able to offer any amount between ₵{bargainPrice} and ₵{listingPriceNum} (up to 10% discount).
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  description: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  calcBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  calcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calcText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
  },
  infoNoteText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
    flex: 1,
  },
});
