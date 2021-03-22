require('dotenv').config();
const express = require('express');
const requestIP = require('request-ip');
const logger = require('../logger/logger');
const checkAuth = require('../middlewares/check-auth');
const db = require('../helpers/db');
const bash = require('shelljs');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const SAMPLE_DATA = [
    { name: "angular-project", description: "Template project for Angular", date: new Date("2021-04-20").toLocaleDateString('en-US'), stars: 3 },
    { name: "node-project", description: "Template project for node", date: "2021-04-19", stars: 5 },
    { name: "react-project", description: "Template project for react", date: "2021-04-17", stars: 10 },
    { name: "python-project", description: "Template project for python", date: "2021-04-15", stars: 24 },
    { name: "java-project", description: "Template project for java", date: "2021-04-16", stars: 4 },
    { name: "js-project", description: "Template project for js", date: "2021-04-12", stars: 0 },
    { name: "css-project", description: "Template project for css", date: "2021-04-10", stars: 6 },
    { name: "html-project", description: "Template project for html", date: "2021-04-05", stars: 9 },
    { name: "go-project", description: "Template project for go", date: "2021-03-22", stars: 45 },
    { name: "c++-project", description: "Template project for c++", date: "2021-03-25", stars: 6 },
    { name: "c-project", description: "Template project for c", date: "2021-03-24", stars: 3 },
    { name: "c#-project", description: "Template project for c#", date: "2021-03-15", stars: 8 },
    { name: "perl-project", description: "Template project for perl", date: "2021-03-10", stars: 4 },
    { name: "php-project", description: "Template project for php", date: "2021-03-05", stars: 1 },
    { name: "swift-project", description: "Template project for swift", date: "2021-02-20", stars: 9 },
    { name: "angular-project", description: "Template project for Angular", date: new Date("2021-04-20").toLocaleDateString('en-US'), stars: 3 },
    { name: "node-project", description: "Template project for node", date: "2021-04-19", stars: 5 },
    { name: "react-project", description: "Template project for react", date: "2021-04-17", stars: 10 },
    { name: "python-project", description: "Template project for python", date: "2021-04-15", stars: 24 },
    { name: "java-project", description: "Template project for java", date: "2021-04-16", stars: 4 },
    { name: "js-project", description: "Template project for js", date: "2021-04-12", stars: 0 },
    { name: "css-project", description: "Template project for css", date: "2021-04-10", stars: 6 },
    { name: "html-project", description: "Template project for html", date: "2021-04-05", stars: 9 },
]

router.get('/search', (req, res) => {
    const keyword = req.query.value;
    const page = req.query.page;
    const data = SAMPLE_DATA.filter(repo => { return repo.name.includes(keyword); });
    logger.log({ level: 'info', message: `search results for ${keyword}` });
    res.render('repo-search', {
        keyword: keyword,
        page: page,
        data: data.slice(page * 10, (page * 10) + 10),
        dataSize: data.length,
        loggedin: false
    });
});

// get all repositories for user
router.get('/repositories', checkAuth, (req, res) => {
    const user = req.user;
    const page = req.query.page;
    logger.log({ level: 'info', message: `getting all repositories for user ${user}` });
    let conn = db.connectDB();
    try {
        let query1 = `SELECT email FROM users WHERE username="${user}" OR email="${user}";`;
        db.getQuery(conn, query1, function (user) {
            if (user !== undefined && user["email"]) {
                // get all repositories for this user
                try {
                    let query2 = `SELECT * FROM repositories WHERE user="${user["email"]}";`;
                    db.getMultipleRows(conn, query2, function (repos) {
                        db.disconnectDB(conn);
                        // console.log(repos);
                        if (repos !== undefined) {
                            res.render('user-repos', {
                                keyword: null,
                                page: page,
                                data: repos.slice(page * 10, (page * 10) + 10),
                                dataSize: repos.length,
                                loggedin: true,
                                token: req.query.token,
                            });
                        } else {
                            res.render('no-results', {
                                keyword: null,
                                loggedin: true,
                                token: req.query.token,
                            });
                        }
                    });
                } catch (error) {
                    logger.log({ level: 'error', message: `query error ${error}` });
                    res.sendStatus(500);
                }
            }
        })
    } catch (error) {
        logger.log({ level: 'error', message: `query error ${error}` });
        res.sendStatus(500);
    }
});

// create new repositories
router.post('/repositories', checkAuth, (req, res) => {
    const user = req.user;
    const data = req.body;
    logger.log({ level: 'info', message: `adding new repositories for user ${user}` });
    let conn = db.connectDB();
    try {
        logger.log({ level: 'info', message: `get user email for ${user}` });
        let query1 = `SELECT email FROM users WHERE username="${user}" OR email="${user}";`;
        db.getQuery(conn, query1, function (user) {
            if (user !== undefined && user["email"]) {
                // get all repositories for this user
                try {
                    let query2 = `SELECT 1 FROM repositories WHERE name="${data.name}";`;
                    db.getQuery(conn, query2, function (exists) {
                        if (exists !== undefined && exists['1']) {
                            res.status(200).json({ message: "repository name taken" });
                        } else {
                            try {
                                let query3 = `INSERT INTO repositories(name,dateCreated,user)
                                VALUES('${data.name}','${new Date()}','${user["email"]}');`;
                                db.runQueryTable(conn, query3, function () {
                                    db.disconnectDB(conn);

                                    /**
                                     * --Shell Script--
                                     * cd to repos dir [done]
                                     * mkdir repoName.git
                                     * cd repoName.git
                                     * git init
                                     */
                                    const repoDirPath = process.env.REPOS_PATH;
                                    var bashOut;
                                    try {
                                        bashOut = bash.cd(repoDirPath).stdout;
                                        logger.log({ level: 'info', message: `bash :: ${bashOut}` });
                                        bashOut = bash.mkdir('-p', `${repoDirPath}/${data.name.trim()}.git`).stdout;
                                        logger.log({ level: 'info', message: `bash :: ${bashOut}` });
                                        bashOut = bash.cd(`${repoDirPath}/${data.name.trim()}.git`).stdout;
                                        logger.log({ level: 'info', message: `bash :: ${bashOut}` });
                                        bashOut = bash.exec('git init', { silent: true }).stdout;
                                        logger.log({ level: 'info', message: `bash :: ${bashOut}` });

                                        res.status(201).json({ message: "created repository successfully" });
                                    } catch (error) {
                                        logger.log({ level: 'error', message: `bash error ${error}` });
                                        res.sendStatus(500);
                                    }
                                });
                            } catch (error) {
                                logger.log({ level: 'error', message: `query error ${error}` });
                                res.sendStatus(500);
                            }
                        }
                    });
                } catch (error) {
                    logger.log({ level: 'error', message: `query error ${error}` });
                    res.sendStatus(500);
                }
            } else {
                res.sendStatus(400);
            }
        })
    } catch (error) {
        logger.log({ level: 'error', message: `query error ${error}` });
        res.sendStatus(500);
    }
});

module.exports = router;