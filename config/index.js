const loggerCfg = require("./logger.cfg");
const dbCfg = require("./db.cfg");
const urlCfg = require("./url.cfg");
const pathCfg = require("./path.cfg");
const accountCfg = require("./account.cfg");
const puppeteerCfg = require("./puppeteer.cfg");
const chatbot = require("./chatbot.cfg");
module.exports = {
    production: {
        port: 8080,
        db: dbCfg.production,
        url: urlCfg.production,
        path: pathCfg.production,
        account: accountCfg.production,
        puppeteer: puppeteerCfg.production,
        chatbot: chatbot.production,
    },
    dev: {
        port: 8080,
        log: loggerCfg.dev,
        db: dbCfg.dev,
        url: urlCfg.dev,
        path: pathCfg.dev,
        account: accountCfg.dev,
        puppeteer: puppeteerCfg.dev,
        chatbot: chatbot.dev,
    },
    test: {
        port: 8080,
        log: loggerCfg.test,
        db: dbCfg.test,
        url: urlCfg.test,
        path: pathCfg.test,
        account: accountCfg.test,
        puppeteer: puppeteerCfg.test,
        chatbot: chatbot.test,
    },
    local: {
        port: 8080,
        log: loggerCfg.local,
        db: dbCfg.local,
        url: urlCfg.local,
        path: pathCfg.local,
        account: accountCfg.local,
        puppeteer: puppeteerCfg.local,
        chatbot: chatbot.local,
    },
};
