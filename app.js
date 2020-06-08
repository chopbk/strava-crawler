const initBrowser = require("./crawler");
const stravaLogin = require("./strava/strava-auther");
const fs = require("fs");
(async () => {
  let { browser, page } = await initBrowser();

  //const cookiesString = await fs.readFileSync('./data.json', 'utf8');
  //await page.setCookie(cookieJson);

  const cookiesString = fs.readFileSync("./strava-session.json", "utf8");
  //console.log("cookiesString are ", cookiesString);
  const cookies = JSON.parse(cookiesString);
  //console.log("cookies are ", cookies);

  console.info("setting cookies");
  await page.setCookie.apply(page, cookies);

  //   await stravaLogin(page);
  //  const cookies = await page.cookies();
  //   fs.writeFile(
  //     "canvas-session.json",
  //     JSON.stringify(cookies, null, 2),
  //     function (err) {
  //       if (err) throw err;
  //       console.log("completed write of cookies");
  //     }
  //   );
  //   const token = await page.evaluate(() => {
  //     const token1 = document.querySelector("[name=csrf-token]").content;
  //     return token1;
  //   });
  //   console.info("token", token);

  let clubUrl = "https://www.strava.com/clubs/539741/members";
  await page.goto(clubUrl);
  console.log("Starting giving kudos");
  //const items = await scrapeInfiniteScrollItems(page, extractItems, 5);
  const links = await page.evaluate(() => {
    let members = document.querySelectorAll(
      "ul.list-athletes div.text-headline a"
    );
    members = [...members];
    let memberInfos = [];
    members.forEach((member) => {
      memberInfos.push({
        name: member.textContent,
        link: member.href,
      });
    });
    memberInfos.forEach((memberInfo) => {
      console.log(memberInfo);
    });
    return memberInfos;
  });
  console.log(links);
  await browser.close();
})();
