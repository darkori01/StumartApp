import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentType } from './types';

// IMPLEMENTATION NOTE: real payment verification must happen server-side via the payment gateway's webhook or verify-transaction endpoint. This mock step exists only to demo the UX; do not treat client-side "success" as authoritative once a backend exists — the order must only be marked paid after server-side confirmation.

interface PaymentVerificationModalProps {
  totalAmount: number;
  paymentMethod: PaymentType;
  paymentDetailsMasked: string;
  onSuccess: () => void;
  onFailedRetry: () => void;
  onChangePaymentMethod: () => void;
}

export const PaymentVerificationModal: React.FC<PaymentVerificationModalProps> = ({
  totalAmount,
  paymentMethod,
  paymentDetailsMasked,
  onSuccess,
  onFailedRetry,
  onChangePaymentMethod,
}) => {
  // Status state: 'processing' | 'success' | 'failed'
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  
  // Dev-only toggle for forcing outcome in demo (defaults to 90% success rate if untouched)
  const [forceOutcome, setForceOutcome] = useState<'auto' | 'force_success' | 'force_failed'>('auto');

  useEffect(() => {
    runVerificationProcess();
  }, [forceOutcome]);

  const runVerificationProcess = () => {
    setStatus('processing');
    const timer = setTimeout(() => {
      let isSuccess = true;

      if (forceOutcome === 'force_success') {
        isSuccess = true;
      } else if (forceOutcome === 'force_failed') {
        isSuccess = false;
      } else {
        // Random 90% success rate
        isSuccess = Math.random() < 0.9;
      }

      if (isSuccess) {
        setStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        setStatus('failed');
      }
    }, 2500); // 2.5 second mock verification delay

    return () => clearTimeout(timer);
  };

  return (
    <View style={styles.container}>
      {/* Dev Toggle Header Banner */}
      <View style={styles.devBar}>
        <Ionicons name="bug-outline" size={14} color="#F59E0B" />
        <Text style={styles.devBarText}>Demo Toggle:</Text>
        <Pressable
          style={[styles.devChip, forceOutcome === 'auto' && styles.devChipActive]}
          onPress={() => setForceOutcome('auto')}
        >
          <Text style={[styles.devChipText, forceOutcome === 'auto' && styles.devChipTextActive]}>
            90% Auto
          </Text>
        </Pressable>
        <Pressable
          style={[styles.devChip, forceOutcome === 'force_success' && styles.devChipActiveSuccess]}
          onPress={() => setForceOutcome('force_success')}
        >
          <Text style={[styles.devChipText, forceOutcome === 'force_success' && styles.devChipTextActive]}>
            Force Pass
          </Text>
        </Pressable>
        <Pressable
          style={[styles.devChip, forceOutcome === 'force_failed' && styles.devChipActiveFail]}
          onPress={() => setForceOutcome('force_failed')}
        >
          <Text style={[styles.devChipText, forceOutcome === 'force_failed' && styles.devChipTextActive]}>
            Force Fail
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        {status === 'processing' && (
          <View style={styles.statusContent}>
            <View style={styles.spinnerCircle}>
              <ActivityIndicator size="large" color="#4F46E5" />
            </View>
            <Text style={styles.title}>Verifying payment...</Text>
            <Text style={styles.subtitle}>
              Authorizing GHS {totalAmount.toFixed(2)} via {paymentDetailsMasked}
            </Text>
            <Text style={styles.hintText}>
              Please do not close this window while we verify your transaction.
            </Text>
          </View>
        )}

        {status === 'success' && (
          <View style={styles.statusContent}>
            <View style={[styles.iconCircle, styles.successCircle]}>
              <Ionicons name="checkmark" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.titleSuccess}>Payment Verified!</Text>
            <Text style={styles.subtitle}>
              GHS {totalAmount.toFixed(2)} received via {paymentDetailsMasked}
            </Text>
            <Text style={styles.redirectingText}>Generating order receipt...</Text>
          </View>
        )}

        {status === 'failed' && (
          <View style={styles.statusContent}>
            <View style={[styles.iconCircle, styles.failedCircle]}>
              <Ionicons name="alert-circle" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.titleFailed}>Payment could not be verified</Text>
            <Text style={styles.subtitleFailed}>
              The transaction was declined by the provider or timed out.
            </Text>

            <View style={styles.actions}>
              <Pressable style={styles.retryBtn} onPress={onFailedRetry}>
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <Text style={styles.retryBtnText}>Retry Payment</Text>
              </Pressable>

              <Pressable style={styles.changeMethodBtn} onPress={onChangePaymentMethod}>
                <Text style={styles.changeMethodText}>Change payment method</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  devBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  devBarText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  devChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#334155',
  },
  devChipActive: {
    backgroundColor: '#4F46E5',
  },
  devChipActiveSuccess: {
    backgroundColor: '#10B981',
  },
  devChipActiveFail: {
    backgroundColor: '#EF4444',
  },
  devChipText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
  },
  devChipTextActive: {
    color: '#FFFFFF',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  statusContent: {
    alignItems: 'center',
    width: '100%',
  },
  spinnerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successCircle: {
    backgroundColor: '#10B981',
  },
  failedCircle: {
    backgroundColor: '#EF4444',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  titleSuccess: {
    fontSize: 19,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 6,
  },
  titleFailed: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EF4444',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitleFailed: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  hintText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  redirectingText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  retryBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  changeMethodBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  changeMethodText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
});
