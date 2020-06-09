const fs = require("fs");
const path = require("path");
const modelsDir = path.dirname(__dirname) + "/models";
const models = Object.assign(
    {},
    ...fs
        .readdirSync(modelsDir)
        .filter((file) => {
            return (
                file.indexOf(".") !== 0 &&
                file !== "index.js" &&
                file.slice(-3) === ".js"
            );
        })
        .map((file) => {
            const model = require(path.join(modelsDir + "/" + file));
            return {
                [model.modelName]: model,
            };
        })
);
module.exports = models;
