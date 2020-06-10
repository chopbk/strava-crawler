const mongoose = require("mongoose");

const models = require("./models/index");
const logger = require("./../utils/logger");
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
    // athlete
    async findAthleteByUsername(username) {
        return this.athlete.findOne({ username: username });
    }
    async findAllAthlete() {
        return this.athlete.find();
    }
    async saveAthleteInfo(athleteInfo) {
        let athlete = await this.athlete.findOne({
            username: athleteInfo.username,
        });
        if (!athlete) {
            logger.debug(`athlete ${athleteInfo.username} does not exist`);
            let newAthlete = await new this.athlete(athleteInfo);
            return newAthlete.save();
        } else {
            logger.debug(`athlete ${athleteInfo.username} exist`);
            return athlete.updateOne(athleteInfo);
        }
    }
    async saveAthleteInfos(athleteInfos) {
        await Promise.all(
            athleteInfos.map(async (athleteInfo) => {
                return this.saveAthleteInfo(athleteInfo);
            })
        );
    }

    // save activity
    async saveActivityInfo(activityInfo) {
        if (!activityInfo) return;
        let activity = await this.activity.findOne({
            activityId: activityInfo.activityId,
        });
        if (!activity) {
            logger.debug(`activity ${activityInfo.activityId} does not exist`);
            let newActivity = await new this.activity(activityInfo);
            return newActivity.save();
        } else {
            logger.debug(`activity ${activityInfo.activityId} exist`);
            return;
        }
    }
    async saveActivityInfos(activityInfos) {
        await Promise.all(
            activityInfos.map(async (activityInfo) => {
                logger.debug(JSON.stringify(activityInfo));
                return this.saveActivityInfo(activityInfo);
            })
        );
    }
    // activities
}
module.exports = Database;
