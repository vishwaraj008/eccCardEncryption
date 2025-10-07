const express = require('express');
const router = express.Router();
const decryptController = require('../controllers/decryptController');

// POST /decrypt
router.post('/', decryptController.decryptHandler);

module.exports = router;
