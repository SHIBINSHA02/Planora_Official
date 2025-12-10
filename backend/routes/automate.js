// backend/routes/automate.js
const express = require('express');
const router = express.Router();

const automateController = require('../controllers/automate')

router.post('/', automateController.automateClassShedule);
router.get('/:classroom_id', automateController.automateClassShedule);

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

module.exports = router;