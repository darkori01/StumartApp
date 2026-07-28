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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOfferActions } from '../hooks';
import { Offer } from '../types';

interface CounterOfferSheetProps {
  visible: boolean;
  onClose: () => void;
  previousOffer: Offer;
  listingTitle: string;
}

export const CounterOfferSheet: React.FC<CounterOfferSheetProps> = ({
  visible,
  onClose,
  previousOffer,
  listingTitle,
}) => {
  const [amountStr, setAmountStr] = useState('');
  const { counterOffer } = useOfferActions();

  const amount = parseInt(amountStr.replace(/[^0-9]/g, ''), 10) || 0;
  const isValid = amount > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    await counterOffer(previousOffer, amount);
    setAmountStr('');
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
                <Text style={styles.title}>Counter Offer</Text>
                <Pressable onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </Pressable>
              </View>

              <Text style={styles.subtitle}>{listingTitle}</Text>
              
              <View style={styles.previousOfferContainer}>
                <Text style={styles.previousOfferLabel}>Countering previous offer:</Text>
                <Text style={styles.previousOfferAmount}>GHS {previousOffer.offerAmount}</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Your New Offer (GHS)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={amountStr}
                    onChangeText={setAmountStr}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    autoFocus
                  />
                  {amountStr ? (
                    <Text style={styles.comparisonText}>
                      Was <Text style={styles.crossedOut}>GHS {previousOffer.offerAmount}</Text> → Now <Text style={styles.newAmount}>GHS {amountStr}</Text>
                    </Text>
                  ) : null}
                </View>
              </View>

              <Pressable
                style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                <Text style={styles.submitBtnText}>Send Counter Offer</Text>
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
    marginBottom: 16,
  },
  previousOfferContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previousOfferLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  previousOfferAmount: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'line-through',
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
  comparisonText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  crossedOut: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  newAmount: {
    color: '#F59E0B',
    fontWeight: '600',
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
