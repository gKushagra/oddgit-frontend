const express = require('express');
const requestIP = require('request-ip');
const logger = require('../logger/logger');
const DOMAIN = 'http://localhost:3112';

const router = express.Router();

router.get('/', (req, res) => {
    const ip = requestIP.getClientIp(req);
    logger.log({ level: 'info', message: `home accessed by ${ip}` });
    res.render('home', { loggedin: false, token: null });
});

router.post('/search', (req, res) => {
    const keyword = req.body.keyword;
    logger.log({ level: 'info', message: `search ${keyword}` })
    res.redirect(`${DOMAIN}/repos/search?value=${keyword}&page=${0}`);
});

module.exports = router;