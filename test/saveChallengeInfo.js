const Crawler = require("./../crawler");
const Strava = require("./../strava");
const Db = require("./../database");
// import config
const CONFIG = require("./../config")[process.env.NODE_ENV || "dev"];
const logger = require("./../utils/logger");
const fileSystem = require("./../utils/file");
const helper = require("./../utils/helper");

(async () => {
    const db = new Db(CONFIG.db);
    const crawler = new Crawler(CONFIG);
    const strava = new Strava(CONFIG);

    try {
        // waiting for init something
        await db.connect();
        await crawler.init();
        await strava.init(crawler.page, db);
        let challengeInfos = [];
        let year = 2020,
            month = 06;
        if (await fileSystem.isFileExist("./data/challenge.json")) {
            logger.debug("load challengeInfos from file system");
            challengeInfos = await fileSystem.readFile("./data/challenge.json");
        }
        if (challengeInfos.length === 0) {
            logger.debug("load challengeInfos from crawler data");

            //get activities of all thletes
            let athletes = await db.findAllAthlete();
            let currentStats = await Promise.all(
                athletes.map(async (athlete) => {
                    console.log(athlete.username);
                    return await strava.getCurrentAthleteStatByUsername(
                        athlete.username,
                        month,
                        year
                    );
                })
            );
            await fileSystem.writeFile("./data/challenge.json", currentStats);
        }
        let rangTime = helper.getStartAndEndTimeOfMonth(month, year);
        let countArr = await Promise.all(
            challengeInfos.map((challengeInfo) => {
                let currentMoney =
                    challengeInfo.targetDistance - challengeInfo.totalDistance;
                challengeInfo.currentMoney =
                    currentMoney > 0 ? currentMoney * 10000 : 0;
                challengeInfo.challengeTime = {
                    month: month,
                    year: year,
                    startTime: rangTime.startTime,
                    endTime: rangTime.endTime,
                };
                return db.saveChallengeInfo(challengeInfo);
            })
        );
        console.log(countArr);
    } catch (error) {
        logger.error("[main] " + error.message);
    } finally {
        await crawler.close();
    }
})();
