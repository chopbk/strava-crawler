const puppeteer = require("puppeteer");

function extractItems() {
  //const extractedElements = document.querySelectorAll('#boxes > div.box');
  const extractedElements = document.querySelectorAll("#dashboard-feed");
  const items = [];
  for (let element of extractedElements) {
    items.push(element.innerText);
  }
  return items;
}

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 10000
) {
  let counter = 1;
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      await page.evaluate(() => {
        document
          .querySelectorAll("button.js-add-kudo")
          .forEach((node) => node.click());
      });
      console.log("Giving kudos for page %d", counter);
      console.log(
        "items.length = %d, itemTargetCount = %d",
        items.length,
        itemTargetCount
      );
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitFor(scrollDelay);
      counter++;
    }
  } catch (e) {}
  return items;
}

const initBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    //userDataDir: "./crawler/puppeteer_data",
  });
  console.log("Opening browser");
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  return {
    browser: browser,
    page: page,
  };
  // await browser.close();
};
module.exports = initBrowser;
