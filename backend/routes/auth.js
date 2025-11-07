// backend/routes/auth.js
const express = require('express');
const router = express.Router(); 
const auth =require('../controllers/auth');

router.post('/', auth.newUser);

module.exports =router;