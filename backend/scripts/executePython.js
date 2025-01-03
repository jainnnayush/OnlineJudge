const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, '../outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = (filePath, inputFilePath, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const command = `python3 "${filePath}" < "${inputFilePath}"`;
        console.log("Executing command:", command);
        exec(command, { timeout }, (error, stdout, stderr) => {
            if (error) {
                console.error("Error:", error.message);
                return reject({ error: error.message, stderr });
            }
            if (stderr) {
                console.error("Standard error output:", stderr);
                return reject({ error: stderr });
            }
            console.log("Execution result:", stdout);
            resolve(stdout);
        });
    });
};

module.exports = {
    executePython,
};