const express= require('express');
const {signup} = require('../controllers/Auth.js')

const router=express.Router();

router.post("/signup",signup);

module.exports = router;