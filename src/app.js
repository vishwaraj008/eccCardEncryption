// src/app.js

const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const KEY_DIR = path.join(__dirname, 'config', 'keys');

// --- Check for key files ---
if (!fs.existsSync(KEY_DIR)) {
  console.error(`Key directory not found: ${KEY_DIR}`);
  process.exit(1);
}

const privateKeyPath = path.join(KEY_DIR, 'serverPrivateKey.pem');
const publicKeyPath = path.join(KEY_DIR, 'serverPublicKey.pem');

if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
  console.error('Missing server ECC keypair.');
  process.exit(1);
}

// --- Middleware ---
app.use(express.json({ limit: '16kb' }));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- Import Routes ---
const publicKeyRoute = require('./routes/publicKeyRoute');
const encryptRoute = require('./routes/encryptRoute');
const decryptRoute = require('./routes/decryptRoute');
const keyRoute = require('./routes/keyRoute');

// --- Register Routes ---
app.use('/public-key', publicKeyRoute);
app.use('/encrypt', encryptRoute);
app.use('/decrypt', decryptRoute);
app.use('/keys', keyRoute);

// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// --- Error middleware ---
const errorMiddleware = require('./middlewares/errorMiddleware');
app.use(errorMiddleware);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`ECC Encryption Backend running at http://localhost:${PORT}`);
});
