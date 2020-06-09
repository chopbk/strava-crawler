const stravaLogin = require("./../strava/strava-auther");
const fileSystem = require("./../utils/file");
const loadOrCreateCookie = async (page, cookiePath) => {
    // Read cookies if exist
    let cookies = null;
    let isCookieExist = await fileSystem.isFileExist(cookiePath);
    if (isCookieExist) {
        cookies = await fileSystem.readFile(cookiePath);
        console.info("setting cookies");
        await page.setCookie.apply(page, cookies);
    } else {
        await stravaLogin(page);
        cookies = await page.cookies();
        await fileSystem.writeFile(cookiePath, cookies);
    }
    return page;
};
module.exports = {
    loadOrCreateCookie,
};
