import React, { useState } from 'react';
import { Alert, Modal, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckoutTarget, Order } from './types';
import { OrderSummarySheet } from './OrderSummarySheet';
import { OrderConfirmationModal } from './OrderConfirmationModal';
import PaystackCheckout from './PaystackCheckout';
import { auth, db } from '../../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

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
  // Step in flow: 1: 'summary', 2: 'verification' (Paystack's hosted checkout), 3: 'confirmation'.
  // Paystack is the only payment path, so there's no separate method-selection step.
  const [step, setStep] = useState<'summary' | 'verification' | 'confirmation'>('summary');

  // Flow State
  const [quantity, setQuantity] = useState<number>(checkoutTarget?.initialQuantity || 1);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Paystack flow state
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [paystackReference, setPaystackReference] = useState<string | null>(null);

  // Static fees for mock demonstration
  const serviceFee = 2.0;
  const deliveryFee = 0.0;

  if (!checkoutTarget) return null;

  const maxStock = checkoutTarget.listing.stock || 10;
  const subtotal = checkoutTarget.unitPriceNum * quantity;
  const grandTotal = subtotal + serviceFee;

  const handleConfirmSummary = async () => {
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
        Alert.alert('Could not start payment', data.error || 'Please try again.');
        return;
      }

      setCheckoutUrl(data.authorization_url);
      setPaystackReference(data.reference);
      setStep('verification');
    } catch (err) {
      console.error('Paystack initialize error:', err);
      Alert.alert('Could not start payment', 'Could not reach the payment server. Check your connection and try again.');
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
        Alert.alert('Payment not completed', 'Your Paystack payment was not successful. Please try again.');
        setStep('summary');
      }
    } catch (err) {
      console.error('Paystack verify error:', err);
      setCheckoutUrl(null);
      Alert.alert('Could not verify payment', 'Please try again.');
      setStep('summary');
    }
  };

  const handlePaymentSuccess = async () => {
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
      buyerId: auth.currentUser?.uid || '',
      buyerName: 'Toni Customer',
      sellerId: checkoutTarget.listing.vendorId || checkoutTarget.listing.vendor,
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
      paymentMethod: 'paystack',
      paymentDetailsMasked: 'Paystack Checkout',
      paymentStatus: 'verified',
      offerId: checkoutTarget.offer?.id || undefined,
      orderStatus: 'Confirmed',
      createdAt: nowIso,
      isUnseenBySeller: true,
    };

    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);
    setStep('confirmation');

    // Sync to Firestore so the vendor's dashboard (a separate login/device) sees this
    // Paystack payment live via its `orders` onSnapshot subscription, not just this device.
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (err) {
      console.error('Order sync error:', (err as any)?.code, (err as any)?.message);
    }
  };

  const handleClose = () => {
    setStep('summary');
    setQuantity(1);
    setCompletedOrder(null);
    setCheckoutUrl(null);
    setPaystackReference(null);
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
