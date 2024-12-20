const express= require('express');
const {signup} = require('../controllers/Auth.js')
const {login} = require('../controllers/Auth.js');
const {logout} = require('../controllers/Auth.js');

const {auth,isAdmin,isUser} = require('../middlewares/auth.js');
const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout", logout);

router.get("/user" , auth , isUser , (req , res) => {
    res.json({
        success : true,
        message : "Welcome to the protected route for the User",
    })
})

router.get("/admin" , auth , isAdmin , (req , res) => {
    res.json({
        success : true,
        message : "Welcome to the protected route for the admin",
    })
})

module.exports = router;