const loggerCfg = require("./logger.cfg");
const dbCfg = require("./db.cfg");
const urlCfg = require("./url.cfg");
const pathCfg = require("./path.cfg");
const accountCfg = require("./account.cfg");
module.exports = {
    production: {
        port: 8080,
        db: dbCfg.production,
        url: urlCfg.production,
        path: pathCfg.production,
        account: accountCfg.production,
    },
    dev: {
        port: 8080,
        log: loggerCfg.dev,
        db: dbCfg.dev,
        url: urlCfg.dev,
        path: pathCfg.dev,
        account: accountCfg.dev,
    },
    test: {
        port: 8080,
        log: loggerCfg.test,
        db: dbCfg.test,
        url: urlCfg.test,
        path: pathCfg.test,
        account: accountCfg.test,
    },
    local: {
        port: 8080,
        log: loggerCfg.local,
        db: dbCfg.local,
        url: urlCfg.local,
        path: pathCfg.local,
        account: accountCfg.local,
    },
};
