import React, { useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, View } from 'react-native';
import { CheckoutTarget, PaymentType, Order } from './types';
import { OrderSummarySheet } from './OrderSummarySheet';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentVerificationModal } from './PaymentVerificationModal';
import { OrderConfirmationModal } from './OrderConfirmationModal';

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

  // Static fees for mock demonstration
  const serviceFee = 2.0;
  const deliveryFee = 5.0;

  if (!checkoutTarget) return null;

  const maxStock = checkoutTarget.listing.stock || 10;
  const subtotal = checkoutTarget.unitPriceNum * quantity;
  const grandTotal = subtotal + serviceFee + deliveryFee;

  const handleConfirmSummary = () => {
    setStep('payment_method');
  };

  const handleSelectPaymentMethod = (method: PaymentType, maskedDetails: string) => {
    setSelectedPaymentMethod(method);
    setPaymentMasked(maskedDetails);
    setStep('verification');
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

        {step === 'verification' && (
          <PaymentVerificationModal
            totalAmount={grandTotal}
            paymentMethod={selectedPaymentMethod}
            paymentDetailsMasked={paymentMasked}
            onSuccess={handlePaymentSuccess}
            onFailedRetry={() => setStep('verification')}
            onChangePaymentMethod={() => setStep('payment_method')}
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
