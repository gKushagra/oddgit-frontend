const express = require('express');
const requestIP = require('request-ip');
const logger = require('../logger/logger');

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

module.exports = router;