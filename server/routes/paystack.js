const express = require('express');
const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Paystack TEST MODE — PAYSTACK_SECRET_KEY in .env must be sk_test_..., never sk_live_.
// Test mode still runs Paystack's real hosted checkout, including its own OTP step.
// Standard published test card for a full successful run:
//   Card: 4084 0840 8408 4081   Expiry: any future date   CVV: 408
//   PIN (if prompted): 0000     OTP (if prompted): 123456
// Paystack also publishes cards that simulate a decline, for demoing the failure path.

// Start a payment — called by the app before opening the WebView
router.post('/initialize', async (req, res) => {
  try {
    const { amount, email, orderId } = req.body;
    if (!amount || !email) {
      return res.status(400).json({ error: 'amount and email are required' });
    }

    const reference = `stumart_${orderId || Date.now()}_${Math.floor(Math.random() * 1e6)}`;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // GHS -> pesewas, smallest unit
        reference,
        currency: 'GHS',
      }),
    });

    const data = await response.json();
    if (!data.status) {
      return res.status(400).json({ error: data.message || 'Paystack initialize failed' });
    }

    res.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error('Paystack initialize error:', err);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

// Confirm what actually happened — the only result the app should trust
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });

    const data = await response.json();
    if (!data.status) {
      return res.status(400).json({ error: data.message || 'Verification failed' });
    }

    res.json({
      status: data.data.status, // 'success' | 'failed' | 'abandoned'
      amount: data.data.amount / 100,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error('Paystack verify error:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;