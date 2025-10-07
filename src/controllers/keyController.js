// src/controllers/keyController.js
const { rotateKeys, getServerKeys } = require('../config/keyManager');


exports.rotateKey = (req, res, next) => {
  try {
    // Optional: basic security check to prevent accidental use in production
    // if (process.env.NODE_ENV === 'production') {
    //   res.status(403);
    //   throw new Error('Key rotation is disabled in production.');
    // }

    // Trigger rotation
    rotateKeys();

    // Get new public key to confirm
    const { publicKey } = getServerKeys();
    const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' });

    res.status(200).json({
      status: 'success',
      message: 'ECC keypair rotated successfully.',
      newPublicKey: publicKeyPem.toString()
    });
  } catch (err) {
    console.error('Key rotation error:', err.message);
    next(err);
  }
};
