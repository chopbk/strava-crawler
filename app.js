const Crawler = require("./crawler");
const Strava = require("./strava");
const Db = require("./database");
// import config
const CONFIG = require("./config")[process.env.NODE_ENV || "dev"];
const URL = CONFIG.url;
const PATH = CONFIG.path;
const logger = require("./utils/logger");

(async () => {
    const db = new Db(CONFIG.db);
    const crawler = new Crawler(CONFIG);
    const strava = new Strava(CONFIG);

    try {
        console.log(URL);

        // waiting for init something
        await db.connect();
        await crawler.init();
        await strava.init(crawler.page);
        await crawler.loadOrCreateCookie(strava.login, PATH.cookie);

        // get clubmember
        // let memberInfos = [];
        // memberInfos = await strava.getMemberOfClubInfo();
        // await db.saveAthleteInfos(memberInfos);
        let athletes = await db.findAllAthlete();
        // get activities of this month
        let activities = [];
        let months = ["01", "02", "03", "04", "05", "06"];
        for (let i = 0; i < athletes.length; i++) {
            console.log(athletes[i]);
            if (athletes[i]) {
                console.log(athletes[i].username);
                //for (let j = 0; j < months.length; j++) {
                activities = await strava.getAllActivitiesByMonth(
                    athletes[i].athleteId,
                    "2020",
                    "04"
                );
                await db.saveActivityInfos(activities);
                // }
            }
        }
    } catch (error) {
        logger.error("[main] " + error.message);
    } finally {
        await crawler.close();
    }
})();
