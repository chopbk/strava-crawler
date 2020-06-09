const startBrowser = require("./crawler");
const cookiePath = "./data/cookies.json";
const memberPath = "./data/member.json";
const { loadOrCreateCookie } = require("./crawler/cookies");
const StravaClub = require("./strava/strava-club");
const Db = require("./database");
const fileSystem = require("./utils/file");
// import config
const CONFIG = require("./config")[process.env.NODE_ENV || "dev"];
const URL = CONFIG.url;
const logger = require("./utils/logger");

(async () => {
    console.log(URL);
    const db = new Db(CONFIG.db);
    await db.connect();

    let { browser, page } = await startBrowser();
    page = await loadOrCreateCookie(page, cookiePath);

    //const items = await scrapeInfiniteScrollItems(page, extractItems, 5);
    let memberInfos = [];
    if (await fileSystem.isFileExist(memberPath)) {
        logger.debug("load member info from file system");
        memberInfos = await fileSystem.readFile(memberPath);
    } else {
        logger.debug("load member info from crawler data");
        memberInfos = await StravaClub.getMemberInfo(page, URL.clubMember);
        await fileSystem.writeFile(memberPath, memberInfos);
    }
    await Promise.all(
        memberInfos.map(async (memberInfo) => {
            let athlete = await db.findOne("athlete", {
                usernmae: memberInfo.usernmae,
            });

            if (!athlete) {
                logger.debug(`athlete ${memberInfo.username} does not exist`);
                return db.createNewDocument("athlete", memberInfo);
            } else {
                logger.debug(`athlete ${memberInfo.username} exist`);
            }
            return;
        })
    );

    await browser.close();
})();
