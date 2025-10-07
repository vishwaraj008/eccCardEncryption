const express = require('express');
const router = express.Router();
const publicKeyController = require('../controllers/publicKeyController');

// GET /public-key
router.get('/', publicKeyController.getPublicKey);

module.exports = router;
