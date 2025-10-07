// src/controllers/encryptController.js
const crypto = require('crypto');
const { getServerKeys } = require('../config/keyManager');
const { generateEphemeralKeys, deriveSharedSecret } = require('../utils/eccUtil');
const { deriveKey } = require('../utils/hkdfUtil');
const { encryptAESGCM } = require('../utils/aesUtil');

/**
 * Encrypt sensitive credit card data using ECC (X25519 + AES-GCM)
 */
exports.encryptHandler = (req, res, next) => {
  try {
    const { cardNumber, expiry, cvv } = req.body;
    if (!cardNumber || !expiry || !cvv) {
      res.status(400);
      throw new Error('Missing required card fields: cardNumber, expiry, cvv');
    }

    // Step 1: Get server public key
    const { publicKey: serverPublicKey } = getServerKeys();

    // Step 2: Generate ephemeral keypair
    const { privateKey: ephPriv, publicKey: ephPub } = generateEphemeralKeys();

    // Step 3: Derive shared secret via ECDH
    const sharedSecret = deriveSharedSecret(ephPriv, serverPublicKey);

    // Step 4: Derive AES-256 key
    const salt = crypto.randomBytes(16);
    const key = deriveKey(sharedSecret, salt);

    // Step 5: AES-GCM encryption
    const payload = JSON.stringify({ cardNumber, expiry, cvv });
    const { iv, ciphertext, tag } = encryptAESGCM(key, Buffer.from(payload, 'utf8'));

    // Step 6: Package envelope
    const envelope = {
      v: '1',
      curve: 'X25519',
      ephemeral_pub: ephPub.export({ type: 'spki', format: 'pem' }),
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      ct: ciphertext.toString('base64'),
      tag: tag.toString('base64'),
    };

    res.status(200).json({ status: 'success', envelope });
  } catch (err) {
    console.error('Encryption error:', err.message);
    next(err);
  }
};
