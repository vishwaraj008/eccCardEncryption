// src/controllers/decryptController.js
const crypto = require('crypto');
const { getServerKeys } = require('../config/keyManager');
const { deriveSharedSecret } = require('../utils/eccUtil');
const { deriveKey } = require('../utils/hkdfUtil');
const { decryptAESGCM } = require('../utils/aesUtil');

/**
 * Decrypts an ECC-encrypted payload envelope.
 */
exports.decryptHandler = (req, res, next) => {
  try {
    const { envelope } = req.body;
    if (!envelope) {
      res.status(400);
      throw new Error('Missing envelope in request body');
    }

    const { ephemeral_pub, salt, iv, ct, tag } = envelope;
    if (!ephemeral_pub || !salt || !iv || !ct || !tag) {
      res.status(400);
      throw new Error('Invalid or incomplete envelope fields');
    }

    // Step 1: Get server private key
    const { privateKey: serverPrivKey } = getServerKeys();

    // Step 2: Rebuild ephemeral public key from PEM
    const ephPubKey = crypto.createPublicKey(ephemeral_pub);

    // Step 3: Derive shared secret
    const sharedSecret = deriveSharedSecret(serverPrivKey, ephPubKey);

    // Step 4: Derive AES key
    const key = deriveKey(sharedSecret, Buffer.from(salt, 'base64'));

    // Step 5: Decrypt
    const plaintext = decryptAESGCM(
      key,
      Buffer.from(iv, 'base64'),
      Buffer.from(ct, 'base64'),
      Buffer.from(tag, 'base64')
    );

    const decryptedData = JSON.parse(plaintext.toString('utf8'));

    res.status(200).json({ status: 'success', decrypted: decryptedData });
  } catch (err) {
    console.error('Decryption error:', err.message);
    next(err);
  }
};
