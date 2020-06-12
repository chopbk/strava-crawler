// contain some function to get data from strava
let StravaLoginURL = "https://www.strava.com/login/";
const fileSystem = require("./../utils/file");
const logger = require("./../utils/logger");
const Validation = require("./../utils/validation");
class Strava {
    constructor(CONFIG) {
        this.URL = CONFIG.url;
        this.PATH = CONFIG.path;
    }
    async init(page, db) {
        this.page = page;
        this.db = db;
    }
    async login() {
        try {
            await this.page.goto(StravaLoginURL);
            console.log("Login into %s", StravaLoginURL);
            await this.page.type("#email", "dinhtam94@gmail.com");
            await this.page.type("#password", "tamhaha123");
            console.log("Inserting user and password");
            await this.page.click("#login-button");
            await this.page.waitForNavigation();
            return this.page;
        } catch (error) {
            logger.error("[login] " + error.message);
        }
    }
    async getMemberOfClubInfo() {
        let memberInfos = [];
        try {
            if (await fileSystem.isFileExist(this.PATH.member)) {
                logger.debug("load member info from file system");
                memberInfos = await fileSystem.readFile(this.PATH.member);
            }
            if (memberInfos.length === 0) {
                logger.debug("load member info from crawler data");
                await this.page.goto(this.URL.clubMember);
                memberInfos = await this.page.evaluate(() => {
                    let members = document.querySelectorAll(
                        "ul.list-athletes div.text-headline a"
                    );
                    members = [...members];
                    let memberInfos = [];
                    members.forEach((member) => {
                        let athleteIdIndex = member.href.lastIndexOf("/");
                        memberInfos.push({
                            name: member.textContent,
                            profileUrl: member.href,
                            athleteId: member.href.slice(athleteIdIndex + 1),
                        });
                    });
                    memberInfos.forEach((memberInfo) => {
                        console.log(memberInfo);
                    });
                    return memberInfos;
                });
                await fileSystem.writeFile(memberPath, memberInfos);
            }
        } catch (error) {
            logger.error("[getMemberInfo] " + error.message);
        } finally {
            return memberInfos;
        }
    }

    async getActivityInfo() {
        let activities = document.querySelectorAll(
            "div.entity-details, div.with-flyby"
        );
        activities = [...activities];
        let activityInfos = activities.map(async (activity) => {
            let activityInfo = {};
            // get athlete info
            let entryAthlete = activity.querySelector(
                "div.entry-head a.entry-athlete"
            );
            activityInfo.athleteId = entryAthlete.href.slice(
                entryAthlete.href.lastIndexOf("/") + 1
            );

            activityInfo.athleteName = entryAthlete.textContent.trim();

            // get time
            let timeStamp = activity.querySelector(
                "div.entry-head time.timestamp"
            );
            activityInfo.timeStartRun = new Date(
                timeStamp.dateTime
            ).toISOString();
            activityInfo.timeStampStartRun = Date.parse(timeStamp.dateTime);

            // get running info
            let entryActivity = activity.querySelector(
                "div.entry-body strong a"
            );
            activityInfo.url = entryActivity.href;
            activityInfo.activityId = entryActivity.href.slice(
                entryActivity.href.lastIndexOf("/") + 1
            );
            const isNumeric = (value) => {
                return /^-{0,1}\d+$/.test(value);
            };
            if (isNumeric(activityInfo.activityId) === false) return null;
            let check = await this.db.findActivityById(activityInfo.activityId);
            if (check) return null;
            activityInfo.name = entryActivity.textContent;
            // get activity stats
            let activityStats = activity.querySelectorAll(
                "div.entry-body ul.inline-stats li"
            );
            let count = 0;
            activityStats.forEach((activityStat) => {
                if (count === 3) return;
                else count++;
                switch (activityStat.title) {
                    case "Distance":
                        let distanceInfo = activityStat.textContent.split(" ");
                        activityInfo.distance = distanceInfo[0];
                        activityInfo.unit = distanceInfo[1];
                        break;
                    case "Pace":
                        let paceInfo = activityStat.textContent.split(" ");
                        activityInfo.pace = paceInfo[0];
                        break;
                    case "Time":
                        activityInfo.runTime = activityStat.textContent;
                }
            });
            return activityInfo;
        });
        // return if activity
        return activityInfos;
    }
    async getRecentlyActivityOfAthlete(athleteId) {
        let activityInfo = {};
        try {
            const athleteUrl = this.URL.athletes + athleteId;
            console.log(athleteUrl);
            await this.page.goto(athleteUrl);
            logger.debug("load renceity activity of athlete");
            activityInfo = await this.page.evaluate(this.getActivityInfo);

            return activityInfo;
        } catch (error) {
            logger.error("[getRecentlyActivityOfAthlete] " + error.message);
        } finally {
            return activityInfo;
        }
    }
    async getAllActivitiesInMonth(athleteId, year, month) {
        let activityInfos = [];
        logger.debug(
            `load activity of athlete ${athleteId} in ${month}/${year}`
        );
        try {
            const athleteUrl =
                this.URL.athletes +
                athleteId +
                this.URL.intervalMonth +
                year +
                month;
            await this.page.goto(athleteUrl);
            activityInfos = await this.page.evaluate(this.getActivityInfo);
        } catch (error) {
            logger.error("[getActivityByMonth] " + error.message);
        } finally {
            return activityInfos.filter(
                (activityInfo) =>
                    activityInfo !== null && !Validation.isEmpty(activityInfo)
            );
        }
    }
    async calculateTotalDistanceInMonth(activities) {
        let totalDistance = 0;
        let totalRun = 0;
        let totalTime = 0;

        totalDistance = activities
            .map((activity) => {
                return parseFloat(activity.distance);
            })
            .reduce((a, b) => {
                return a + b;
            }, 0);
        totalRun = activities.length;
        logger.debug(`athelete have run ${totalDistance} km in this time`);
        logger.debug(`athelete have run ${totalRun} time`);
        return {
            totalDistance: totalDistance,
            totalRun: totalRun,
        };
    }
}
module.exports = Strava;
