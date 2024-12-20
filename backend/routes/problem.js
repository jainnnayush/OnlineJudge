const express = require("express");

const router= express.Router();
const {auth,isAdmin}=require('../middlewares/auth.js');
const {createProblem,deleteProblem,getProblemById}=require('../controllers/Problem.js');

router.post("/createProblem",auth,isAdmin,createProblem);
router.delete("/deleteProblem/:id", auth, isAdmin, deleteProblem);
router.get("/getProblemById/:id",getProblemById);

module.exports = router;