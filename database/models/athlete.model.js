const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create Schema
const AthleteSchema = new Schema({
    name: String,
    username: {
        type: String,
        require: true,
        unique: true,
        index: true,
    },
    athleteId: {
        type: String,
        require: true,
        unique: true,
        index: true,
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "ANOTHER"],
    },
    profileUrl: String,
    summaryStats: {
        distanceMonth: Number,
        distanceYear: Number,
        totalRunMonth: Number,
        totalRunYear: Number,
    },
    challenges: [
        {
            type: Schema.ObjectId,
            ref: "challenge",
        },
    ],
});

module.exports = mongoose.model("athlete", AthleteSchema);
