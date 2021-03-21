const express = require('express');
const requestIP = require('request-ip');
const logger = require('../logger/logger');
const db = require('../helpers/db');
const bcrypt = require('bcrypt');

const router = express.Router();

// render login page
router.get('/login', (req, res) => {
    const ip = requestIP.getClientIp(req);
    logger.log({ level: 'info', message: `login accessed by ${ip}` });
    res.render('login', { error: null, loggedin: false });
});

// render signup page
router.get('/signup', (req, res) => {
    const ip = requestIP.getClientIp(req);
    logger.log({ level: 'info', message: `sign-up accessed by ${ip}` });
    res.render('signup', { error: null, loggedin: false });
});

// login
router.post('/login', (req, res) => {
    const data = req.body; // can also use just JSON.parse(JSON.stringify(req.body))
    
    logger.log({ level: 'info', message: `login ${data.uname}` });
    
    console.log(data);
    
    let conn = db.connectDB();

    try {
        let query = `SELECT password FROM users WHERE username="${data.uname}" OR email="${data.uname}";`
        db.getQuery(conn, query, function (result) {
            console.log(result);
            db.disconnectDB(conn);
            if (result !== undefined) {
                try {
                    bcrypt.compare(data.pass, result.password, (err, result) => {
                        if (err) {
                            logger.log({ level: 'error', message: `bcrypt error ${err}` });
                            throw new Error("Server Error");
                        }

                        if (result) res.status(200).render('home', { loggedin: true });
                        else res.status(200).render('login', {
                            error: "Username or Password Incorrect",
                            loggedin: false
                        });
                    });
                } catch (error) {
                    res.sendStatus(500);
                }
            } else {
                res.status(200).render('login', {
                    error: "Username or Password Incorrect",
                    loggedin: false
                });
            }
        });
    } catch (error) {
        db.disconnectDB(conn);
        res.sendStatus(500);
    }
});

// register
router.post('/signup', async (req, res) => {
    const data = req.body;

    logger.log({ level: 'info', message: `signup ${data.uname}` });

    const hash = await bcrypt.hash(data.pass, 10);
    console.log(hash);

    let conn = db.connectDB();
    try {
        let query1 = `SELECT 1 FROM users WHERE username="${data.uname}" OR email="${data.email}";`;
        db.getQuery(conn, query1, function (result) {
            console.log(result);
            if (result !== undefined && result['1']) {
                res.status(200).render('signup', {
                    error: "Username or Email already exists. Try resetting your password.",
                    loggedin: false
                });
            } else {
                let query2 = `INSERT INTO users(username, email, useDisplayName, password, dateJoined)
                VALUES('${data.uname}','${data.email}','${0}','${hash}','${new Date()}');`;
                try {
                    db.runQueryTable(conn, query2, function () {
                        db.disconnectDB(conn);
                        res.render('login', { error: null, loggedin: false })
                    });
                } catch (error) {
                    db.disconnectDB(conn);
                    res.sendStatus(500);
                }
            }
        });
    } catch (error) {
        db.disconnectDB(conn);
        res.sendStatus(500);
    }
});

module.exports = router;