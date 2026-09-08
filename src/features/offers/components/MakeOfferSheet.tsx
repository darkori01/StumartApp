import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOfferActions } from '../hooks';

interface MakeOfferSheetProps {
  visible: boolean;
  onClose: () => void;
  listingId: string;
  listingAmount: number;
  bargainPrice?: number;
  listingTitle: string;
  onSubmitOffer: (offerAmount: number, quantity: number) => void;
}

export const MakeOfferSheet: React.FC<MakeOfferSheetProps> = ({
  visible,
  onClose,
  listingId,
  listingAmount,
  bargainPrice,
  listingTitle,
  onSubmitOffer,
}) => {
  const [amountStr, setAmountStr] = useState('');
  const [quantityStr, setQuantityStr] = useState('1');

  const amount = parseInt(amountStr.replace(/[^0-9]/g, ''), 10) || 0;
  const quantity = parseInt(quantityStr.replace(/[^0-9]/g, ''), 10) || 1;

  const floorPrice = bargainPrice ?? Math.round(listingAmount * 0.9);
  const ceilingPrice = listingAmount;

  const getValidationFeedback = () => {
    if (!amountStr) {
      return {
        text: `Enter an amount between ₵${floorPrice} and ₵${ceilingPrice}`,
        color: '#6B7280',
        isValid: false,
      };
    }
    if (amount < floorPrice) {
      return {
        text: `Minimum offer is ₵${floorPrice}`,
        color: '#EF4444',
        isValid: false,
      };
    }
    if (amount > ceilingPrice) {
      return {
        text: `Maximum offer is ₵${ceilingPrice}`,
        color: '#EF4444',
        isValid: false,
      };
    }
    return {
      text: `Offer in pre-approved range (₵${floorPrice} – ₵${ceilingPrice})`,
      color: '#10B981',
      isValid: true,
    };
  };

  const feedback = getValidationFeedback();
  const isValid = feedback.isValid && quantity > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmitOffer(amount, quantity);
    setAmountStr('');
    setQuantityStr('1');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.sheet}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Make an Offer</Text>
                <Pressable onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </Pressable>
              </View>

              <Text style={styles.subtitle}>{listingTitle}</Text>
              <Text style={styles.listedPrice}>Listed at GHS {listingAmount}</Text>

              <View style={styles.rangeBox}>
                <Ionicons name="pricetag-outline" size={16} color="#4F46E5" />
                <Text style={styles.rangeText}>
                  Offer between ₵{floorPrice} and ₵{ceilingPrice}.
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Your Offer (GHS)</Text>
                  <TextInput
                    style={[
                      styles.input,
                      amountStr !== '' && !feedback.isValid && styles.inputError,
                      feedback.isValid && styles.inputSuccess,
                    ]}
                    keyboardType="numeric"
                    value={amountStr}
                    onChangeText={setAmountStr}
                    placeholder={`e.g. ${floorPrice}`}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={[styles.hintText, { color: feedback.color }]}>
                    {feedback.text}
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Quantity</Text>
                  <View style={styles.quantityControl}>
                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() => setQuantityStr(Math.max(1, quantity - 1).toString())}
                    >
                      <Ionicons name="remove" size={20} color="#4F46E5" />
                    </Pressable>
                    <TextInput
                      style={styles.qtyInput}
                      keyboardType="numeric"
                      value={quantityStr}
                      onChangeText={setQuantityStr}
                    />
                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() => setQuantityStr((quantity + 1).toString())}
                    >
                      <Ionicons name="add" size={20} color="#4F46E5" />
                    </Pressable>
                  </View>
                </View>
              </View>

              <Pressable
                style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                <Text style={styles.submitBtnText}>Submit Offer</Text>
              </Pressable>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 4,
  },
  listedPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  rangeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  rangeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3730A3',
    flex: 1,
  },
  form: {
    gap: 20,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  qtyBtn: {
    padding: 16,
  },
  qtyInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#1F2937',
  },
  submitBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#FCD34D',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
