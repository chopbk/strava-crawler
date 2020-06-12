const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create Schema
const ClubSummarySchema = new Schema({});

module.exports = clubSummary = mongoose.model("clubSummary", ClubSummarySchema);
