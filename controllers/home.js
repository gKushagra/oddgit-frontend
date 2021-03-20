const express = require('express');
const logger = require('../logger/logger');

const router = express.Router();

router.get('/', (req, res) => {
    logger.log({ level: 'info', message: 'Home view requested' });
    res.send('home');
});

module.exports = router;