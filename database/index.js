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
                if (athleteInfo) return this.saveAthleteInfo(athleteInfo);
            })
        );
    }

    // activities
    async findActivityById(activityId) {
        let athlete = await this.activity.findOne({
            activityId: activityId,
        });
        return athlete;
    }
    // save activity
    async saveActivityInfo(activityInfo) {
        console.log(activityInfo);
        if (!activityInfo) return;
        let activity = await this.activity.findOne({
            activityId: activityInfo.activityId,
        });
        if (!activity) {
            logger.debug(
                `activity ${activityInfo.activityId} of ${activityInfo.athleteName} does not exist`
            );
            let newActivity = await new this.activity(activityInfo);
            await newActivity.save();
            return 1;
        } else {
            logger.debug(
                `activity ${activityInfo.activityId} of ${activityInfo.athleteName} exist`
            );
            return 0;
        }
    }
    async saveActivityInfos(activityInfos) {
        let countArrary = await Promise.all(
            activityInfos.map(async (activityInfo) => {
                console.log(activityInfo);
                return this.saveActivityInfo(activityInfo);
            })
        );
        return countArrary.reduce((a, b) => {
            return a + b;
        }, 0);
    }
    /**
     * @description
     * @param {Number} athleteId
     * @param {Date} startTime
     * @param {Date} endTime
     */
    async findAllActivitiesOfAthleteInTime(athleteId, startTime, endTime) {
        logger.debug(
            `get all activities in startTime ${startTime} and endTime ${endTime}`
        );
        let activities = await this.activity.find({
            athleteId: athleteId,
            timeStartRun: {
                $gte: startTime,
                $lte: endTime,
            },
        });
        return activities;
    }
    /**
     * This function find last activity in DB
     */
    async findLastActivity() {
        let activity = await this.activity.findOne(
            {
                timeStartRun: {
                    $lte: new Date().toISOString(),
                },
            },
            {},
            { sort: { timeStartRun: -1 } }
        );
        return activity;
    }
}
module.exports = Database;
