const Crawler = require("./crawler");
const Strava = require("./strava");
const Db = require("./database");
const ChatBot = require("./chatbot");
// import config
const CONFIG = require("./config")[process.env.NODE_ENV || "dev"];
const URL = CONFIG.url;
const PATH = CONFIG.path;
const logger = require("./utils/logger");
const helper = require("./utils/helper");
// Import events module
var events = require("events");

(async () => {
    const db = new Db(CONFIG.db);
    const crawler = new Crawler(CONFIG);
    const strava = new Strava(CONFIG);
    const chatBot = new ChatBot(CONFIG);
    // Create an EventEmitter object
    var eventEmitter = new events.EventEmitter();

    try {
        // waiting for init something
        await db.connect();
        await crawler.init();
        await strava.init(crawler.page, db);
        await crawler.loadOrCreateCookie(strava.login, PATH.cookie);
        // await chatBot.init(eventEmitter);

        // get clubmember
        // let memberInfos = [];
        // memberInfos = await strava.getMemberOfClubInfo();
        // await db.saveAthleteInfos(memberInfos);

        // get activities of athelete
        // let athlete = await db.findAthleteByUsername("tamnd12");
        // if (athlete) await getActivityOfAthlete(athlete, strava, db);

        //get activities of all thletes
        // let athletes = await db.findAllAthlete();
        // //get activities of this month
        // let months = ["01", "02", "03", "04", "05", "06"];
        // for (let i = 0; i < athletes.length; i++) {
        //     await getActivityOfAthlete(athletes[i], strava, db);
        // }

        // calculate athlete sumary
        // get activities of athelete
        // let athlete = await db.findAthleteByUsername("bacnc1");
        // let rangTime = helper.getStartAndEndTimeOfMonth(6, 2020);

        // let activities = await db.findAllActivitiesOfAthleteInTime(
        //     athlete.athleteId,
        //     rangTime.startTime,
        //     rangTime.endTime
        // );
        // await strava.calculateTotalDistanceInMonth(activities);

        eventEmitter.addListener("getLastActivity", async (threadId) => {
            let activity = await db.findLastActivity();
            if (activity) {
                let content = `${activity.athleteName} vừa chạy ${
                    activity.distance
                } vào lúc  ${new Date(activity.timeStartRun)}\n
                xem chi tiết tại đây  ${activity.url}`;
                chatBot.sendMessage(content, threadId);
            }
        });
        eventEmitter.addListener("getMonthSumary", async (threadId) => {
            let activity = await db.findLastActivity();
            if (activity) {
                let content = `${activity.athleteName} vừa chạy ${
                    activity.distance
                } km vào lúc  ${new Date(activity.timeStartRun)}\n
                xem chi tiết tại đây  ${activity.url}`;
                chatBot.sendMessage(content, threadId);
            }
        });
    } catch (error) {
        logger.error("[main] " + error.message);
    } finally {
        await crawler.close();
    }
})();
const getActivityOfAthlete = async (athlete, strava, db) => {
    let activities = [];
    //for (let j = 0; j < months.length; j++) {
    activities = await strava.getAllActivitiesInMonth(
        athlete.athleteId,
        "2020",
        "06"
    );
    let totalActivitySave = await db.saveActivityInfos(activities);
    logger.info(`save total ${totalActivitySave} activities`);
    // }
    return;
};
