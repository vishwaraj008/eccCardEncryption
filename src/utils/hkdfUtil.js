// src/utils/hkdfUtil.js
/**
 * HKDF Utility
 * ------------
 * Derives strong symmetric keys from shared secrets.
 * Used for ECDH -> AES key derivation in ECC encryption.
 */

const crypto = require('crypto');

/**
 * Derive a symmetric key using HKDF-SHA256.
 * @param {Buffer} ikm - Input key material (shared secret)
 * @param {Buffer} salt - Random salt (16 bytes recommended)
 * @param {Buffer|string} info - Context string, e.g. "ecc-cc-encryption"
 * @param {number} length - Output key length (default 32 bytes)
 * @returns {Buffer} derived key
 */
function deriveKey(ikm, salt, info = 'ecc-cc-encryption', length = 32) {
  return crypto.hkdfSync('sha256', ikm, salt, Buffer.from(info), length);
}

module.exports = { deriveKey };
