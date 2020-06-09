const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create Schema
const ActivitySchema = new Schema({
    distance: String,
    pace: String,
    runTime: String,
    time: Date,
});
module.exports = Activity = mongoose.model("activity", ActivitySchema);
