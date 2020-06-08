const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const logger = require("../utils/logger");
//Create Schema
const AthleteSchema = new Schema({
  name: String,
  username: String,
  stravaId: String,
  profileUrl: String,
});
module.exports = Room = mongoose.model("athlete", AthleteSchema);
