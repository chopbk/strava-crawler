const mongoose = require("mongoose");

const models = require("./models/index");
class Database {
    constructor(CONFIG) {
        this.config = CONFIG;
        for (let key in models) {
            this[key] = models[key];
        }
        this.models = models;
    }
    async connect() {
        console.log(this.models);
        try {
            await mongoose.connect(this.config.url, this.config.options);
            console.log("MongoDB database connection established successfully");
        } catch (error) {
            throw error;
        }
        return mongoose.connection;
    }
    async createNewDocument(modelName, data) {
        try {
            let newData = await new this[modelName](data);
            return newData.save();
        } catch (error) {
            console.log("[createNewDocument] " + error.message);
        }
    }
    async findOne(modelName, query) {
        try {
            return this[modelName].findOne(query);
        } catch (error) {
            console.log("[createNewDocument] " + error.message);
        }
    }
}
module.exports = Database;
