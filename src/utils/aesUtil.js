// src/utils/aesUtil.js
/**
 * AES-GCM Utility
 * ---------------
 * Provides encryption and decryption helpers for symmetric data encryption.
 * Used after deriving key from ECDH via HKDF.
 */

const crypto = require('crypto');

/**
 * Encrypt data using AES-256-GCM
 * @param {Buffer} key - 32-byte AES key
 * @param {Buffer} plaintext - data to encrypt
 * @param {Buffer} [aad] - optional additional authenticated data
 * @returns {Object} { iv, ciphertext, tag }
 */
function encryptAESGCM(key, plaintext, aad = null) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  if (aad) cipher.setAAD(aad);

  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return { iv, ciphertext, tag };
}

/**
 * Decrypt data using AES-256-GCM
 * @param {Buffer} key - 32-byte AES key
 * @param {Buffer} iv - initialization vector (12 bytes)
 * @param {Buffer} ciphertext - encrypted data
 * @param {Buffer} tag - authentication tag
 * @param {Buffer} [aad] - optional AAD
 * @returns {Buffer} decrypted plaintext
 */
function decryptAESGCM(key, iv, ciphertext, tag, aad = null) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  if (aad) decipher.setAAD(aad);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted;
}

module.exports = { encryptAESGCM, decryptAESGCM };
