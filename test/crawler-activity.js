let activities = document.querySelectorAll(
    "div.entity-details  div.entry-container"
);
activities = [...activities];
let activityInfos = activities.map((activity) => {
    let activityInfo = {};
    // get athlete info
    let entryAthlete = activity.querySelector("div.entry-head a.entry-athlete");
    activityInfo.athleteId = entryAthlete.href.slice(
        entryAthlete.href.lastIndexOf("/") + 1
    );

    activityInfo.athleteName = entryAthlete.textContent;

    // get time
    let timeStamp = activity.querySelector("div.entry-head time.timestamp");
    activityInfo.timeStartRun = Date.parse(timeStamp.dateTime);

    // get running info
    let entryBody = activity.querySelector("div.entry-body");
    let entryActivity = entryBody.querySelector("a");
    activityInfo.url = entryActivity.href;
    activityInfo.activityId = entryActivity.href.slice(
        entryActivity.href.lastIndexOf("/") + 1
    );
    activityInfo.name = entryActivity.textContent;
    // get activity stats
    let activityStats = activity.querySelectorAll("ul.inline-stats li");
    console.log(activityInfo);
    activityStats.forEach((activityStat) => {
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
