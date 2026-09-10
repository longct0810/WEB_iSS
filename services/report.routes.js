// routes/report.routes.js
const express = require('express');
const router = express.Router();

const reportController = require('../controllers/report.controller');

router.get('/daily-operation', reportController.getDailyOperation);

module.exports = router;