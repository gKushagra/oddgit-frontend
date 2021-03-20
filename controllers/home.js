const express = require('express');
const requestIP = require('request-ip');
const logger = require('../logger/logger');

const router = express.Router();

router.get('/', (req, res) => {
    const ip = requestIP.getClientIp(req);
    logger.log({ level: 'info', message: `home accessed by ${ip}` });
    res.send('home');
});

module.exports = router;