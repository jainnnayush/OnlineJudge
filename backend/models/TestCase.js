const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
    input : {
        type:String,
        required:true,
    },
    output:{
        type:String,
        required:true,
    },
});

module.exports= mongoose.model("TestCase",testCaseSchema);
