const express    = require('express');
const app        = express();
const port       = 3001;
const path       = require('path');
const bodyParser = require('body-parser')

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    console.log(`The request url is: ${req.url}`);

    next();
});

app.get('/', (req, res) => {
    res.render('signup_page');
});


app.listen(port, (req, res) => {
    console.log(`Listening on port: ${port}`);
});