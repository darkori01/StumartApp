import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentType } from './types';

interface PaymentMethodSelectorProps {
  totalAmount: number;
  onSelectPayment: (method: PaymentType, maskedDetails: string) => void;
  onBack: () => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  totalAmount,
  onSelectPayment,
  onBack,
}) => {
  const [selectedType, setSelectedType] = useState<PaymentType>('mobile_money');

  // Mobile Money State
  const [momoProvider, setMomoProvider] = useState<'MTN' | 'Telecel' | 'AT'>('MTN');
  const [momoPhone, setMomoPhone] = useState('054 123 4567');

  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Wallet State
  const walletBalance = 150.0;

  // Format phone number as format-as-you-type (e.g., 054 123 4567)
  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    setMomoPhone(formatted);
  };

  // Format card number (16 digits separated by spaces)
  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  // Format card expiry MM/YY
  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  const handleCvvChange = (text: string) => {
    setCardCvv(text.replace(/\D/g, '').slice(0, 3));
  };

  const getMaskedDetails = (): string => {
    if (selectedType === 'mobile_money') {
      const digits = momoPhone.replace(/\D/g, '');
      const last4 = digits.slice(-4) || '1234';
      return `${momoProvider} MoMo ••${last4}`;
    }
    if (selectedType === 'card') {
      const digits = cardNumber.replace(/\D/g, '');
      const last4 = digits.slice(-4) || '4242';
      return `Card ••${last4}`;
    }
    return `StuMart Wallet (Bal: GHS ${walletBalance.toFixed(2)})`;
  };

  const isFormValid = (): boolean => {
    if (selectedType === 'mobile_money') {
      return momoPhone.replace(/\D/g, '').length === 10;
    }
    if (selectedType === 'card') {
      return (
        cardNumber.replace(/\D/g, '').length === 16 &&
        cardExpiry.length === 5 &&
        cardCvv.length === 3
      );
    }
    if (selectedType === 'wallet') {
      return walletBalance >= totalAmount;
    }
    return false;
  };

  const handlePayPress = () => {
    if (!isFormValid()) return;
    onSelectPayment(selectedType, getMaskedDetails());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#4F46E5" />
        </Pressable>
        <Text style={styles.headerTitle}>Select Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionSubtitle}>
          Choose how you would like to complete your order of{' '}
          <Text style={styles.highlightAmount}>GHS {totalAmount.toFixed(2)}</Text>
        </Text>

        {/* 1. Mobile Money Option (PRIMARY FOR MARKET) */}
        <Pressable
          style={[
            styles.cardOption,
            selectedType === 'mobile_money' && styles.cardOptionSelectedPrimary,
          ]}
          onPress={() => setSelectedType('mobile_money')}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconCirclePrimary}>
              <Ionicons name="phone-portrait-outline" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.cardTitleWrap}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>Mobile Money</Text>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Primary in Ghana</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>MTN MoMo, Telecel Cash, AT Money</Text>
            </View>
            <Ionicons
              name={selectedType === 'mobile_money' ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={selectedType === 'mobile_money' ? '#4F46E5' : '#CBD5E1'}
            />
          </View>

          {/* Inline Expansion for Mobile Money */}
          {selectedType === 'mobile_money' && (
            <View style={styles.inlineForm}>
              <Text style={styles.inputLabel}>Network Provider</Text>
              <View style={styles.providerRow}>
                {(['MTN', 'Telecel', 'AT'] as const).map((prov) => (
                  <Pressable
                    key={prov}
                    style={[
                      styles.providerChip,
                      momoProvider === prov && styles.providerChipActive,
                    ]}
                    onPress={() => setMomoProvider(prov)}
                  >
                    <Text
                      style={[
                        styles.providerChipText,
                        momoProvider === prov && styles.providerChipTextActive,
                      ]}
                    >
                      {prov}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Mobile Money Number</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="call-outline" size={18} color="#64748B" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 054 123 4567"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={momoPhone}
                  onChangeText={handlePhoneChange}
                  maxLength={12}
                />
              </View>
              <Text style={styles.inputHint}>Prompt will be sent to your phone to authorize.</Text>
            </View>
          )}
        </Pressable>

        {/* 2. Card Payment Option */}
        <Pressable
          style={[styles.cardOption, selectedType === 'card' && styles.cardOptionSelected]}
          onPress={() => setSelectedType('card')}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="card-outline" size={22} color="#7C3AED" />
            </View>
            <View style={styles.cardTitleWrap}>
              <Text style={styles.cardTitle}>Credit / Debit Card</Text>
              <Text style={styles.cardSubtitle}>Visa, Mastercard</Text>
            </View>
            <Ionicons
              name={selectedType === 'card' ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={selectedType === 'card' ? '#7C3AED' : '#CBD5E1'}
            />
          </View>

          {/* Inline Expansion for Card */}
          {selectedType === 'card' && (
            <View style={styles.inlineForm}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="card-outline" size={18} color="#64748B" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  maxLength={19}
                />
              </View>

              <View style={styles.rowTwoInputs}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.textInputShort}
                    placeholder="MM/YY"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    value={cardExpiry}
                    onChangeText={handleExpiryChange}
                    maxLength={5}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>CVV Code</Text>
                  <TextInput
                    style={styles.textInputShort}
                    placeholder="123"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    secureTextEntry
                    value={cardCvv}
                    onChangeText={handleCvvChange}
                    maxLength={3}
                  />
                </View>
              </View>
            </View>
          )}
        </Pressable>

        {/* 3. In-App Wallet Option */}
        <Pressable
          style={[styles.cardOption, selectedType === 'wallet' && styles.cardOptionSelected]}
          onPress={() => setSelectedType('wallet')}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconCircleWallet}>
              <Ionicons name="wallet-outline" size={22} color="#10B981" />
            </View>
            <View style={styles.cardTitleWrap}>
              <Text style={styles.cardTitle}>StuMart Wallet</Text>
              <Text style={styles.cardSubtitle}>
                Available Balance: GHS {walletBalance.toFixed(2)}
              </Text>
            </View>
            <Ionicons
              name={selectedType === 'wallet' ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={selectedType === 'wallet' ? '#10B981' : '#CBD5E1'}
            />
          </View>

          {selectedType === 'wallet' && (
            <View style={styles.inlineForm}>
              {walletBalance < totalAmount ? (
                <View style={styles.insufficientBox}>
                  <Ionicons name="warning-outline" size={16} color="#EF4444" />
                  <Text style={styles.insufficientText}>
                    Insufficient wallet balance. Please select Mobile Money or Card.
                  </Text>
                </View>
              ) : (
                <View style={styles.walletInfoBox}>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
                  <Text style={styles.walletInfoText}>
                    Instant checkout from your StuMart campus wallet balance.
                  </Text>
                </View>
              )}
            </View>
          )}
        </Pressable>
      </ScrollView>

      {/* Primary Payment CTA Button with clear amount */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.payBtn, !isFormValid() && styles.payBtnDisabled]}
          onPress={handlePayPress}
          disabled={!isFormValid()}
        >
          <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
          <Text style={styles.payBtnText}>Pay GHS {totalAmount.toFixed(2)}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  highlightAmount: {
    fontWeight: '800',
    color: '#4F46E5',
  },
  cardOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  cardOptionSelectedPrimary: {
    borderColor: '#4F46E5',
    backgroundColor: '#FAF5FF',
  },
  cardOptionSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCirclePrimary: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleWallet: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  popularBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  inlineForm: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  providerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  providerChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  providerChipActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },
  providerChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  providerChipTextActive: {
    color: '#FFFFFF',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  fieldIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  rowTwoInputs: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  textInputShort: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  inputHint: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
  },
  insufficientBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  insufficientText: {
    fontSize: 12,
    color: '#DC2626',
    flex: 1,
  },
  walletInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  walletInfoText: {
    fontSize: 12,
    color: '#065F46',
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  payBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  payBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
