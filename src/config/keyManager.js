// src/config/keyManager.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KEY_DIR = path.join(__dirname, 'keys');
const PRIV_KEY_PATH = path.join(KEY_DIR, 'serverPrivateKey.pem');
const PUB_KEY_PATH = path.join(KEY_DIR, 'serverPublicKey.pem');

// Cache keys in memory (loaded once)
let cachedKeys = null;

/**
 * Load existing ECC keys from disk.
 * Generates new ones if missing and dev mode is enabled.
 */
function loadKeys() {
  try {
    // Check if keys already loaded
    if (cachedKeys) return cachedKeys;

    // Verify directory
    if (!fs.existsSync(KEY_DIR)) fs.mkdirSync(KEY_DIR, { recursive: true });

    // If keys exist, read them
    if (fs.existsSync(PRIV_KEY_PATH) && fs.existsSync(PUB_KEY_PATH)) {
      const privateKeyPem = fs.readFileSync(PRIV_KEY_PATH, 'utf8');
      const publicKeyPem = fs.readFileSync(PUB_KEY_PATH, 'utf8');

      const privateKey = crypto.createPrivateKey(privateKeyPem);
      const publicKey = crypto.createPublicKey(publicKeyPem);

      cachedKeys = { privateKey, publicKey };
      console.log('ECC keypair loaded successfully.');
      return cachedKeys;
    }

    // Otherwise, generate a new keypair (only for dev environments)
    console.warn('No existing keypair found. Generating new one...');
    const { privateKey, publicKey } = crypto.generateKeyPairSync('x25519');

    fs.writeFileSync(PRIV_KEY_PATH, privateKey.export({ type: 'pkcs8', format: 'pem' }));
    fs.writeFileSync(PUB_KEY_PATH, publicKey.export({ type: 'spki', format: 'pem' }));

    cachedKeys = { privateKey, publicKey };
    console.log('New ECC keypair generated and stored.');
    return cachedKeys;
  } catch (err) {
    console.error('KeyManager loadKeys() failed:', err.message);
    throw new Error('Failed to load or generate ECC keys.');
  }
}

/**
 * Get server ECC keys (lazy-loaded + cached)
 * @returns {Object} { privateKey, publicKey }
 */
function getServerKeys() {
  if (!cachedKeys) loadKeys();
  return cachedKeys;
}


function rotateKeys() {
  try {
    console.warn('Rotating ECC server keypair...');
    const { privateKey, publicKey } = crypto.generateKeyPairSync('x25519');

    fs.writeFileSync(PRIV_KEY_PATH, privateKey.export({ type: 'pkcs8', format: 'pem' }));
    fs.writeFileSync(PUB_KEY_PATH, publicKey.export({ type: 'spki', format: 'pem' }));

    cachedKeys = { privateKey, publicKey };
    console.log('Key rotation successful.');
  } catch (err) {
    console.error('Key rotation failed:', err.message);
    throw new Error('Failed to rotate ECC keypair.');
  }
}

module.exports = {
  getServerKeys,
  rotateKeys,
  loadKeys
};
