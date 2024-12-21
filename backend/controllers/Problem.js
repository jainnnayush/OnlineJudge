const mongoose = require('mongoose');
const Testcase = require('../models/TestCase.js');
const Problem = require('../models/Problem.js');

// create problem (admin only)
exports.createProblem = async(req,res)=>{
    try {
        const {problemName,problemStatement,difficulty,testCases}=req.body;
        if(!problemName || !problemStatement || !difficulty || !testCases){
            return res.status(401).json({
                success:false,
                message:"All fields are required",
            });
        }
        for (const testCase of testCases) {
            if (!testCase.input || !testCase.output) {
                return res.status(400).json({
                    success: false,
                    message: "Each test case must have both 'input' and 'output'",
                });
            }
        } 
        
        //console.log("testCases before Testcase.create:", testCases);

        // Validate each test case
        for (const [index, testCase] of testCases.entries()) {
            if (!testCase.input || !testCase.output) {
                return res.status(400).json({
                    success: false,
                    message: `Test case at index ${index} is invalid. Both 'input' and 'output' are required.`,
                });
            }
        }
        //console.log("here");
        const savedTestCases = await Testcase.create(testCases);
        //console.log("here");
        const testCaseIds = savedTestCases.map(testCase=>testCase._id);

        const newProblem = new Problem({
            problemName,
            problemStatement,
            difficulty,
            testCases:testCaseIds,
        })

        await newProblem.save();

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem: newProblem,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create a problem",
        });
    }
}

// delete problem (admin only)
exports.deleteProblem = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }
        const deletedProblem = await Problem.findByIdAndDelete(id);

        if (!deletedProblem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Problem deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete problem",
        });
    }
};

// get all problem
exports.getAllProblems = async (req, res) => {
    try {
      const problems = await Problem.find({});
  
      return res.status(200).json({
        success: true,
        problems,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Error in accessing the problems",
      });
    }
  };

// get problem by id
exports.getProblemById = async(req,res) =>{
    try {
        const id=req.params.id;

        const problem = await Problem.findById(id).populate('testCases');
        if(!problem){
            return res.status(404).json({
                success:true,
                message:"Problem not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Problem fetched successfully",
            problem,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch problem",
        });
    }
};