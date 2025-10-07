// inside eccUtil.js
const { getServerKeys } = require('../config/keyManager');

function loadServerKeys() {
  return getServerKeys(); // clean, consistent source
}
module.exports = { loadServerKeys };