const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create Schema
const AthleteSummarySchema = new Schema({});

module.exports = athleteSummary = mongoose.model(
    "atheleteSummary",
    AthleteSummarySchema
);
