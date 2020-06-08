let StravaURL = "https://www.strava.com/login/";

const stravaLogin = async (page) => {
  await page.goto(StravaURL);
  console.log("Login into %s", StravaURL);
  await page.type("#email", "dinhtam94@gmail.com");
  await page.type("#password", "tamhaha123");
  console.log("Inserting user and password");
  await page.click("#login-button");

  await page.waitForNavigation();

  return page;
  // await browser.close();
};
module.exports = stravaLogin;
