const express = require("express");

const router= express.Router();
const {auth,isAdmin}=require('../middlewares/auth.js');
const {createProblem,deleteProblem,getProblemById,getAllProblems,updateProblem}=require('../controllers/Problem.js');

router.post("/createProblem",auth,isAdmin,createProblem);
router.delete("/deleteProblem/:id", auth, isAdmin, deleteProblem);
router.get("/getProblem/:id",getProblemById);
router.get("/getAllProblems" ,  getAllProblems);
router.put("/updateProblem/:id",auth,isAdmin,updateProblem);

module.exports = router;