const loggerCfg = require("./logger.cfg");
const mailCfg = require("./mail.cfg");
const encryptCfg = require("./encrypt.cfg");
const dbCfg = require("./db.cfg");
module.exports = {
  production: {
    port: 8080,
    db: dbCfg.production,
  },
  dev: {
    port: 8080,
    log: loggerCfg.dev,
    db: dbCfg.dev,
  },
  test: {
    port: 8080,
    log: loggerCfg.test,
    db: dbCfg.test,
  },
  local: {
    port: 8080,
    log: loggerCfg.local,
    db: dbCfg.local,
  },
};
