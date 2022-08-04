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
    //     res.redirect('/');
    // }
    next();
});
/* json of users
structure: {
    'email@gmail.com': 'email@email.com',
    'password': 'password',
    'balance': 'balance'
}
*/

let users        = {}
let current_user = {}

app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    console.log(`The request url is: ${req.url}`);

    next();
});

/* No mvc pattern yet */
app.post('/register', (req, res) => {
    /* Check if user exist */
    let {first_name, last_name, email, password} = req.body;
    /* Checker for required fields */
    if(first_name && last_name && email && password) {
        if(!users[email]){
            users[email] = {
                email: email,
                password: password,
                first_name: first_name,
                last_name: last_name,
                balance: 0
            };
            current_user = users[email];
            req.session.email = email;

            res.redirect('/home');
        }
        else{
            res.redirect('/signup_page');
        }
    }
    else{
        res.redirect('/signup_page');
    }
});

app.post('/login', (req, res) =>{
    let { email, password } = req.body;
    if(email && password){

        if(users[email]){
            current_user = users[email];
            res.redirect('/home');
        }
        else{
            res.redirect('/signup_page')
        }
    }
});

app.get('/home', (req, res) => {
    res.render('home', {user_details: current_user});
});

app.get('/', (req, res) => {
    res.render('signup_page');
});

app.post('/withdraw', (req, res) =>{
    let {withdraw_balance} = req.body;

    if (isNaN(withdraw_balance) || parseInt(withdraw_balance) <= 1){
        console.log("asddsadasdsa");
        console.log("asddsadasdsa");
        console.log("asddsadasdsa");
        console.log("asddsadasdsa");
        current_user.message = "cannot withhdraw amount"
        res.redirect(req.get('referer'));

    }
    current_user.message = parseInt(withdraw_balance) > parseInt(current_user.balance) ? "no balance yet" : `Successfully withdrawn ${withdraw_balance}`;

    if(parseInt(withdraw_balance) > parseInt(current_user.balance)){
        current_user.message = "no balance yet"
    }
    else{
        current_user.message = `Successfully withdrawn ${withdraw_balance}`

        current_user.balance = parseInt(current_user.balance) - parseInt(withdraw_balance);
    }

    res.redirect(req.get('referer'));
});

app.post('/deposit', (req, res) =>{
    let {deposit_amount} = req.body;

    current_user.message = `successfully deposited ${deposit_amount}. Your new balance is now ${parseInt(deposit_amount) + parseInt(current_user.balance)}`;

    current_user.balance = parseInt(deposit_amount) + parseInt(current_user.balance);

    res.redirect(req.get('referer'));
});

app.get('/logout', (req, res) =>{
    current_user = {};
    res.redirect('/');
});

app.get('*', (req, res) =>{
    res.render('signup_page');
});



app.listen(port, (req, res) => {
    console.log(`Listening on port: ${port}`);
});