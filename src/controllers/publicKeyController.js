// src/controllers/publicKeyController.js
const { getServerKeys } = require('../config/keyManager');

exports.getPublicKey = (req, res, next) => {
  try {
    const { publicKey } = getServerKeys();

    // Export as PEM
    const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' });

    return res.status(200).json({
      status: 'success',
      curve: 'X25519',
      publicKey: publicKeyPem.toString(),
    });
  } catch (err) {
    console.error('Error reading public key:', err.message);
    next(err);
  }
};
