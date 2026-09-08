const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

// Allow the Expo app (web, devices, emulators) to call this server.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const PORT = process.env.PORT || 4000;

// Simple health check so the app can confirm the backend is reachable.
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT && parseInt(process.env.SMTP_PORT, 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) return null;
  return nodemailer.createTransport({ host, port, auth: { user, pass }, secure: port === 465 });
}

app.post('/send-code', async (req, res) => {
  const { email, code, purpose } = req.body || {};
  if (!email || !code || !purpose) return res.status(400).json({ error: 'Missing fields' });

  const transporter = createTransport();
  const subject = purpose === 'forgot' ? 'Your Stumart password reset code' : 'Your Stumart verification code';
  const text = `Your Stumart ${purpose === 'forgot' ? 'password reset' : 'verification'} code is: ${code}`;

  if (!transporter) {
    console.warn('SMTP not configured. Skipping send.');
    return res.json({ ok: true, info: 'smtp-not-configured' });
  }

  try {
    const info = await transporter.sendMail({ from: process.env.FROM_EMAIL || 'no-reply@stumart.app', to: email, subject, text });
    return res.json({ ok: true, info });
  } catch (err) {
    console.error('send-code error', err);
    return res.status(500).json({ error: 'Unable to send email' });
  }
});

// mount chat endpoints
const chatRoutes = require('./chat');
app.use('/', chatRoutes);
// mount vendor endpoints
const vendorRoutes = require('./vendor');
app.use('/', vendorRoutes);

const paystackRoutes = require('./routes/paystack');
app.use('/paystack', paystackRoutes);

// Bind on 0.0.0.0 so physical devices and emulators on the LAN can reach it.
app.listen(PORT, '0.0.0.0', () => console.log(`Stumart server listening on 0.0.0.0:${PORT}`));

