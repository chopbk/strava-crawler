const puppeteer = require("puppeteer");
const fileSystem = require("./../utils/file");
const logger = require("./../utils/logger");
class Crawler {
    constructor(CONFIG) {
        this.PATH = CONFIG.path;
    }
    async init() {
        this.browser = await puppeteer.launch({
            headless: true,
            //userDataDir: "./crawler/puppeteer_data",
        });
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 926 });
    }
    async loadOrCreateCookie(login) {
        // Read cookies if exist
        let cookies = null;
        let isCookieExist = await fileSystem.isFileExist(this.PATH.cookie);
        if (isCookieExist) {
            cookies = await fileSystem.readFile(this.PATH.cookie);
            console.info("setting cookies");
            await this.page.setCookie.apply(this.page, cookies);
        } else {
            await login(this.page);
            cookies = await this.page.cookies();
            await fileSystem.writeFile(this.PATH.cookie, cookies);
        }
    }
    async scrapeInfiniteScrollItems(
        extractItems,
        itemTargetCount,
        scrollDelay = 10000
    ) {
        let counter = 1;
        let items = [];
        try {
            let previousHeight;
            while (items.length < itemTargetCount) {
                await this.page.evaluate(() => {
                    document
                        .querySelectorAll("button.js-add-kudo")
                        .forEach((node) => node.click());
                });
                console.log("Giving kudos for this.page %d", counter);
                console.log(
                    "items.length = %d, itemTargetCount = %d",
                    items.length,
                    itemTargetCount
                );
                items = await this.page.evaluate(extractItems);
                previousHeight = await this.page.evaluate(
                    "document.body.scrollHeight"
                );
                await this.page.evaluate(
                    "window.scrollTo(0, document.body.scrollHeight)"
                );
                await this.page.waitForFunction(
                    `document.body.scrollHeight > ${previousHeight}`
                );
                await this.page.waitFor(scrollDelay);
                counter++;
            }
        } catch (e) {}
        return items;
    }
    async close() {
        return await this.browser.close();
    }
}
module.exports = Crawler;
