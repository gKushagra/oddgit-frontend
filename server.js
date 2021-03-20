require('dotenv').config();
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3112;

app.set('view engine', 'ejs');

const homeController = require('./controllers/home');
app.use('/home', homeController);

app.listen(PORT, () => { 
    console.log(`app running on PORT ${PORT}`); 
});