const winston = require("winston");
//require("winston-daily-rotate-file");
const CircularJSON = require("circular-json");
var CONFIG = require("../config")[process.env.NODE_ENV || "dev"];
// -------------------------------------
//      SETUP LOGGER with Winston
// -------------------------------------
// try to make some pretty output
const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...args } = info;
    const ts = timestamp.slice(0, 19).replace("T", " ");
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? CircularJSON.stringify(args, null, 2) : ""
    }`;
  })
);

const logger = winston.createLogger({
  level: CONFIG.log.level || "debug",
  format: alignedWithColorsAndTime,
  //transports: [transport],
});

logger.add(
  new winston.transports.Console({
    format: alignedWithColorsAndTime,
  })
);
module.exports = logger;
