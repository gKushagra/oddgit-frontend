const express = require('express');
const requestIP = require('request-ip');
const logger = require('../logger/logger');
const db = require('../helpers/db');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');

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
router.post('/login', async (req, res) => {
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

                        if (result) {
                            // build token
                            let token = jwt.generateJWT(data.uname);
                            res.status(200).render('home', { loggedin: true, token: token });
                        }
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

// reset request
router.get('/reset/:email', async (req, res) => {

});

// reset 
router.post('/reset', async (req, res) => {

});

// logout
router.get('/logout', (req, res) => {
    logger.log({ level: 'info', message: 'logout accessed' });
    res.render('logout', { loggedin: true, logout: true });
});

// verify token
router.get('/verify-token', (req, res) => {
    logger.log({ level: 'info', message: 'validating existing token' });
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decodeJWT(token);
    // console.log(decodedToken);
    // check is user is in our database
    let conn = db.connectDB();
    try {
        let query = `SELECT 1 FROM users WHERE username="${decodedToken.user}" OR email="${decodedToken.user}";`;
        db.getQuery(conn, query, function (result) {
            db.disconnectDB(conn);
            if (result !== undefined && result['1']) {
                // generate new token
                let newToken = jwt.generateJWT(decodedToken.user);
                res.status(308).render('home', { loggedin: true, token: newToken });
            } else {
                res.status(308).render('home', { loggedin: false, token: null });
            }
        });
    } catch (error) {
        logger.log({ level: 'error', message: 'query error' });
        res.sendStatus(500);
    }
});

module.exports = router;