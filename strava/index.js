// contain some function to get data from strava
let StravaLoginURL = "https://www.strava.com/login/";
const fileSystem = require("./../utils/file");
const logger = require("./../utils/logger");

class Strava {
    constructor(CONFIG) {
        this.URL = CONFIG.url;
        this.PATH = CONFIG.path;
    }
    async init(page) {
        this.page = page;
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
        let activityInfos = activities.map((activity) => {
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
            if (isNumeric(activityInfo.activityId) === false) return;
            activityInfo.name = entryActivity.textContent;
            // get activity stats
            let activityStats = activity.querySelectorAll(
                "div.entry-body ul.inline-stats li"
            );
            console.log(activityInfo);
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
    async getAllActivitiesByMonth(athleteId, year, month) {
        let activityInfos = [];
        try {
            const athleteUrl =
                this.URL.athletes +
                athleteId +
                this.URL.intervalMonth +
                year +
                month;
            console.log(athleteUrl);
            await this.page.goto(athleteUrl);
            logger.debug(`load activity of athlete in ${month}/${year}`);
            activityInfos = await this.page.evaluate(this.getActivityInfo);
            return activityInfos;
        } catch (error) {
            logger.error("[getActivityByMonth] " + error.message);
        } finally {
            return activityInfos;
        }
    }
}
module.exports = Strava;
