// src/routes/keyRoute.js
const express = require('express');
const router = express.Router();
const keyController = require('../controllers/keyController');

// POST /rotate-key
router.post('/rotate-key', keyController.rotateKey);

module.exports = router;
