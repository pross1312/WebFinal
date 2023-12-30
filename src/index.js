require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');

// config
app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    }),
);

require('./config/passport-config')(app);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// -----

app.use((req, res, next) => {
    console.log(req.session);
    next();
});

app.use('/auth', require('./route/auth.route'));


app.use((req, res, next) => {
    // authentication guard
    console.log(req.user);
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/auth/login');
    }
});

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).send('Welcome bro');
    } else {
        res.redirect('/auth/login');
    }
});

app.use((err, req, res, next) => {
    // guard exception
    console.log(err);
    res.status(500).send('Internal server error');
});


const ensureAuthorization = (req, res, next) => {
    // TODO Check Account type
    if (true) {
        next();
    }
    else{
        res.redirect("/");
    }
};
app.use('/admin', ensureAuthorization, require('./route/admin.route'))


app.listen(13123, async () => {
    await require('./module/database').init_if_not_exist('./init.sql');
});
