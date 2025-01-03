const mongoose = require("mongoose");
const Testcase = require("../models/TestCase.js");
const Problem = require("../models/Problem.js");

// create problem (admin only)
exports.createProblem = async (req, res) => {
  try {
    const { problemName, problemStatement, difficulty, testCases } = req.body;
    if (!problemName || !problemStatement || !difficulty || !testCases) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
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
    const testCaseIds = savedTestCases.map((testCase) => testCase._id);

    const newProblem = new Problem({
      problemName,
      problemStatement,
      difficulty,
      testCases: testCaseIds,
    });

    await newProblem.save();

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create a problem",
    });
  }
};

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
    //console.log(problems);
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
exports.getProblemById = async (req, res) => {
  try {
    const id = req.params.id;

    const problem = await Problem.findById(id).populate("testCases");
    if (!problem) {
      return res.status(404).json({
        success: true,
        message: "Problem not found",
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

// update problem by id
exports.updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id);
    const { problemName, problemStatement, difficulty, testCases } = req.body;
    if (!problemName || !problemStatement || !difficulty || !testCases) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // const savedTestCases = await Promise.all(
    //     testCases.map(async (testCase)=>{
    //         //console.log(testCase._id);
    //         if(testCase._id){
    //             console.log("already present");
    //             return testCase._id;
    //         }
    //         else{
    //            const newTestCase = await Testcase.create({
    //                 input:testCase.input,
    //                 output:testCase.output
    //            });
    //            return newTestCase._id;
    //         }
    //     })
    // );
    const savedTestCases = await Promise.all(
        testCases.map(async (testCase) => {
      
          // Check if a test case with the same input and output exists
          const existingTestCase = await Testcase.findOne({
            input: testCase.input,
            output: testCase.output,
          });
      
          if (existingTestCase) {
            return existingTestCase._id; // Use the existing test case ID
          }
      
          // Create a new test case if not found
          const newTestCase = await Testcase.create({
            input: testCase.input,
            output: testCase.output,
          });
          return newTestCase._id;
        })
      );
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        problemName,
        problemStatement,
        difficulty,
        testCases:savedTestCases,
      },
      { new: true, runValidators: true }
    );
    if (!updatedProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem updated",
      updatedProblem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to update problem", error: error.message });
  }
};

exports.getAllProblemsWithUserStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const problems = await Problem.find();
    const solutions = await Solution.find({ user: userId });

    const problemsWithStatus = problems.map((problem) => {
      const solved = solutions.some(solution => 
        solution.problem.toString() === problem._id.toString() && solution.verdict === 'Accepted'
      );

      return {
        ...problem.toObject(),
        solved,
      };
    });

    return res.status(200).json({
      success: true,
      problems: problemsWithStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in accessing the problems",
    });
  }
};
