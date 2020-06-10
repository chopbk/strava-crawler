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
});

module.exports = mongoose.model("athlete", AthleteSchema);
