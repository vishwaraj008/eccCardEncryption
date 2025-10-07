const express = require('express');
const router = express.Router();
const encryptController = require('../controllers/encryptController');

// POST /encrypt
router.post('/', encryptController.encryptHandler);

module.exports = router;
