require('dotenv').config();

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
    format: combine(
        label({ label: 'log' }),
        timestamp(),
        logFormat
    ),
    transports: [new transports.File({ filename: __dirname + '/logs/app.log' })]
});

// if(process.env.NODE_ENV !== 'production') {
//     logger.add(new transports.Console({
//         format: format.simple(),
//     }));
// }

module.exports = logger;