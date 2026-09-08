import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckoutTarget, PaymentType, Order } from './types';
import { OrderSummarySheet } from './OrderSummarySheet';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { OrderConfirmationModal } from './OrderConfirmationModal';
import PaystackCheckout from './PaystackCheckout';

const DEFAULT_API_HOST =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
const API_BASE = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_HOST;

interface CheckoutFlowModalProps {
  visible: boolean;
  checkoutTarget: CheckoutTarget | null;
  onClose: () => void;
  onOrderCompleted: (createdOrder: Order) => void;
  onViewOrdersRequested: () => void;
}

export const CheckoutFlowModal: React.FC<CheckoutFlowModalProps> = ({
  visible,
  checkoutTarget,
  onClose,
  onOrderCompleted,
  onViewOrdersRequested,
}) => {
  // Step in flow: 1: 'summary', 2: 'payment_method', 3: 'verification', 4: 'confirmation'
  const [step, setStep] = useState<'summary' | 'payment_method' | 'verification' | 'confirmation'>('summary');

  // Flow State
  const [quantity, setQuantity] = useState<number>(checkoutTarget?.initialQuantity || 1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentType>('mobile_money');
  const [paymentMasked, setPaymentMasked] = useState<string>('MTN MoMo ••1234');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Paystack flow state
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [paystackReference, setPaystackReference] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Static fees for mock demonstration
  const serviceFee = 2.0;
  const deliveryFee = 0.0;

  if (!checkoutTarget) return null;

  const maxStock = checkoutTarget.listing.stock || 10;
  const subtotal = checkoutTarget.unitPriceNum * quantity;
  const grandTotal = subtotal + serviceFee;

  const handleConfirmSummary = () => {
    setStep('payment_method');
  };

  const handleSelectPaymentMethod = async (method: PaymentType, maskedDetails: string) => {
    setSelectedPaymentMethod(method);
    setPaymentMasked(maskedDetails);
    setPaymentError(null);

    try {
      const res = await fetch(`${API_BASE}/paystack/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          email: 'buyer@st.knust.edu.gh',
          orderId: checkoutTarget.listing.id,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.authorization_url) {
        setPaymentError(data.error || 'Could not start payment');
        return;
      }

      setCheckoutUrl(data.authorization_url);
      setPaystackReference(data.reference);
      setStep('verification');
    } catch (err) {
      console.error('Paystack initialize error:', err);
      setPaymentError('Could not reach payment server');
    }
  };

  const handlePaystackComplete = async () => {
    if (!paystackReference) return;

    try {
      const res = await fetch(`${API_BASE}/paystack/verify/${paystackReference}`);
      const data = await res.json();

      setCheckoutUrl(null);

      if (data.status === 'success') {
        handlePaymentSuccess();
      } else {
        setPaymentError('Payment was not successful. Please try again.');
        setStep('payment_method');
      }
    } catch (err) {
      console.error('Paystack verify error:', err);
      setCheckoutUrl(null);
      setPaymentError('Could not verify payment');
      setStep('payment_method');
    }
  };

  const handlePaymentSuccess = () => {
    // Generate Order Object matching mock Order shape
    const orderId = `STM-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: Order = {
      id: orderId,
      buyerId: 'customer:toni',
      buyerName: 'Toni Customer',
      sellerId: checkoutTarget.listing.vendor,
      sellerName: checkoutTarget.listing.vendor,
      items: [
        {
          productId: checkoutTarget.listing.id,
          title: checkoutTarget.listing.title,
          imageUrl: checkoutTarget.listing.image,
          quantity,
          unitPrice: checkoutTarget.unitPriceNum,
          originalUnitPrice: checkoutTarget.originalPriceNum,
          lineTotal: subtotal,
          isNegotiated: !!checkoutTarget.offer || !!(checkoutTarget.originalPriceNum && checkoutTarget.originalPriceNum > checkoutTarget.unitPriceNum),
          offerId: checkoutTarget.offer?.id || undefined,
        },
      ],
      subtotal,
      serviceFee,
      deliveryFee,
      total: grandTotal,
      paymentMethod: selectedPaymentMethod,
      paymentDetailsMasked: paymentMasked,
      paymentStatus: 'verified',
      offerId: checkoutTarget.offer?.id || undefined,
      orderStatus: 'Confirmed',
      createdAt: nowIso,
      isUnseenBySeller: true,
    };

    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);
    setStep('confirmation');
  };

  const handleClose = () => {
    setStep('summary');
    setQuantity(1);
    setCompletedOrder(null);
    setCheckoutUrl(null);
    setPaystackReference(null);
    setPaymentError(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        {step === 'summary' && (
          <OrderSummarySheet
            checkoutTarget={checkoutTarget}
            quantity={quantity}
            maxStock={maxStock}
            serviceFee={serviceFee}
            deliveryFee={deliveryFee}
            onQuantityChange={(q) => setQuantity(q)}
            onConfirm={handleConfirmSummary}
            onBack={handleClose}
          />
        )}

        {step === 'payment_method' && (
          <PaymentMethodSelector
            totalAmount={grandTotal}
            onSelectPayment={handleSelectPaymentMethod}
            onBack={() => setStep('summary')}
          />
        )}

        {step === 'verification' && checkoutUrl && (
          <PaystackCheckout
            authorizationUrl={checkoutUrl}
            onComplete={handlePaystackComplete}
          />
        )}

        {step === 'confirmation' && completedOrder && (
          <OrderConfirmationModal
            order={completedOrder}
            onViewOrder={() => {
              handleClose();
              onViewOrdersRequested();
            }}
            onContinueShopping={handleClose}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
