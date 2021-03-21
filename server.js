require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 3112;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

let db = require('./helpers/db');
let conn = db.connectDB();
if(conn) {
    db.ifNotExistCreateTables(conn);
    db.disconnectDB(conn);
}

const homeController = require('./controllers/home');
const authController = require('./controllers/auth');
const reposController = require('./controllers/repos');

app.use('/home', homeController);
app.use('/auth', authController);
app.use('/repos', reposController);

app.listen(PORT, () => {
    console.log(`app running on PORT ${PORT}`);
});