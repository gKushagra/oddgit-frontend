const express = require('express');
const requestIP = require('request-ip');
const logger = require('../logger/logger');

const router = express.Router();

router.get('/', (req, res) => {
    const ip = requestIP.getClientIp(req);
    logger.log({ level: 'info', message: `home accessed by ${ip}` });
    res.render('home', { loggedin: false });
});

router.post('/search', (req, res) => {
    const keyword = req.body.keyword;
    logger.log({ level: 'info', message: `search ${keyword}` })
    res.redirect(`http://localhost:3112/repos/search?value=${keyword}&page=${0}`);
});

module.exports = router;