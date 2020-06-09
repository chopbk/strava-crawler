let activity = document.querySelector("div.entry-container");
let athleteDom = activity.querySelector("div.entry-head a");
let athleteId = athleteDom.href.slice(athlete.href.lastIndexOf("/") + 1);
let timeDom = activity.querySelector("div.entry-head time.timestamp");
let time = timeDom.datetime;
