const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create Schema
const AthleteSchema = new Schema({
    name: String,
    username: String,
    stravaId: String,
    profileUrl: String,
});
module.exports = mongoose.model("athlete", AthleteSchema);
