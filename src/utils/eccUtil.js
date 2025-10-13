// src/utils/eccUtil.js
/**
 * ECC Utility
 * -----------
 * Handles:
 * - Loading server ECC keypair (via keyManager)
 * - Generating ephemeral keypairs
 * - Deriving shared secret using ECDH (X25519)
 */

const crypto = require('crypto');
const { getServerKeys } = require('../config/keyManager');

/**
 * Load server keys from keyManager (wrapper)
 * @returns {Object} { privateKey, publicKey }
 */
function loadServerKeys() {
  return getServerKeys();
}

/**
 * Generate a new ephemeral keypair (for encryption)
 * @returns {Object} { privateKey, publicKey }
 */
function generateEphemeralKeys() {
  try {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('x25519');
    return { privateKey, publicKey };
  } catch (err) {
    console.error('❌ Failed to generate ephemeral ECC keypair:', err.message);
    throw new Error('Ephemeral key generation failed.');
  }
}

/**
 * Derive shared secret between private & public keys (ECDH)
 * @param {KeyObject} privateKey - local private key
 * @param {KeyObject} publicKey - remote public key
 * @returns {Buffer} shared secret
 */
function deriveSharedSecret(privateKey, publicKey) {
  try {
    const shared = crypto.diffieHellman({ privateKey, publicKey });
    return shared;
  } catch (err) {
    console.error('❌ ECDH shared secret derivation failed:', err.message);
    throw new Error('ECDH key exchange failed.');
  }
}

module.exports = {
  loadServerKeys,
  generateEphemeralKeys,
  deriveSharedSecret,
};
