const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create Schema
const ActivitySchema = new Schema({
    activityId: {
        type: String,
        require: true,
        unique: true,
        index: true,
    },
    athleteId: {
        type: String,
        require: true,
        index: true,
        ref: "athlete",
    },
    athleteName: String,
    name: String,
    distance: String,
    timeStartRun: String,
    timeStampStartRun: String,
    url: String,
    unit: String,
    pace: String,
    runTime: String,
});

module.exports = Activity = mongoose.model("activity", ActivitySchema);
