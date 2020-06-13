const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create Schema
const ChallengeSchema = new Schema({
    athleteId: {
        type: String,
        require: true,
        index: true,
        ref: "athlete",
    },
    username: {
        type: String,
        require: true,
        index: true,
    },
    athleteName: String,
    clubId: String,
    challengeTime: {
        month: Number,
        year: Number,
        startTime: Date,
        endTime: Date,
    },
    targetDistance: Number,
    totalDistance: Number,
    totalRun: Number,
    currentMoney: Number,
});

module.exports = Challenge = mongoose.model("challenge", ChallengeSchema);
