const fs = require("fs");
const writeFile = async (filePath, data) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), function (err) {
        if (err) throw err;
        console.log("completed write data");
    });
};
const readFile = async (filePath) => {
    let data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
};
const isFileExist = async (filePath) => {
    return fs.existsSync(filePath);
};
module.exports = {
    writeFile,
    readFile,
    isFileExist,
};
