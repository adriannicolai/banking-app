const express    = require('express');
const app        = express();
const port       = 3001;
const path       = require('path');
const bodyParser = require('body-parser');
const session    = require('express-session');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
/* Checker if user wants to go to home page without session */
app.use((req, res, next) => {
    console.log(`the request url is ${req.url}`);
    // if(req.session.user){
    //     res.redirect("/");
    // }
    next();
});
/* json of users
structure: {
    "email@gmail.com": "email@email.com",
    "password": "password",
    "balance": "balance"
}
*/
let users        = {}

app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    console.log(`The request url is: ${req.url}`);

    next();
});

app.get('/', (req, res) => {
    res.render('signup_page');
});

app.get("*", (req, res) =>{
    
});


app.listen(port, (req, res) => {
    console.log(`Listening on port: ${port}`);
});