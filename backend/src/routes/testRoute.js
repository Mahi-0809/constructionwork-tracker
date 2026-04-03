// Express router lets us define routes separately from the main server file
const express = require('express');
const router = express.Router();

// Import the controller function
const { testConnection } = require('../controllers/testController');

// When GET /api/test is called → run testConnection
router.get('/test', testConnection);

// Export the router
module.exports = router;