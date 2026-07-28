import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OfferButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const OfferButton: React.FC<OfferButtonProps> = ({ onPress, disabled }) => {
  return (
    <Pressable
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name="pricetag" size={15} color={disabled ? '#9CA3AF' : '#F59E0B'} />
      <Text style={[styles.text, disabled && styles.textDisabled]}>Make Offer</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB', // very light amber tint
    gap: 6,
    flex: 1, // To flex properly next to buy now
  },
  disabled: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  text: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
  },
  textDisabled: {
    color: '#9CA3AF',
  },
});
