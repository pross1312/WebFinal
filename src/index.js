require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const PORT = process.env.PORT || 1234
const payment_req = require("./module/payment_req");
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
    console.log("[INFO] %s %s", req.method, req.path);
    console.log("[INFO]", req.session);
    next();
});

app.use('/auth', require('./route/auth.route'));
app.use((req, res, next) => {
    // authentication guard
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/auth/login');
    }
});

app.use('/payment', require('./route/payment.route'));
app.use((req, res, next) => { // NOTE: payment_access_token should not be allowed to pass payment route
    if (req.session.payment_access_token) delete req.session.payment_access_token;
    next();
});
app.get('/', (req, res) => {
    if (req.user?.type === "customer") {
        res.render('user/homepage'); 
    } else if (req.user?.type === "admin") {
        res.redirect("/admin");
    } else {
        next(new Error("Invalid type " + req.user?.type));
    }
});

app.use((err, req, res, next) => {
    // guard exception
    console.log(err);
    res.status(500).send('Internal server error');
});

const ensureAuthorization = (req, res, next) => {
    // TODO Check Account type
    if (req.user?.type === "admin") {
        next();
    } else{
        res.redirect("/");
    }
};
app.use('/admin', ensureAuthorization, require('./route/admin.route'))

app.use((req, res, next) => {
    res.status(404).send("Not found");
});

app.use((err, req, res, next) => {
    // guard exception
    console.log(err);
    res.status(500).send('Internal server error');
});

// have fun when use PORT -_-
const reset = "\x1b[0m";
const cyan = "\x1b[96m";
const underline = "\x1b[4m";
app.listen(13123, async () => {
    console.log(`${cyan}${underline}App running at: http://localhost:${PORT}${reset}`);
    const init = await require('./module/database').init_if_not_exist('./init.sql');
    if (init) { // NOTE: init random data here
        for (var i = 0; i < 50; i++) {
            const data = new (require("./model/Product.model").Product)({
                name: "Random",
                price: Math.random()*1000000,
                stock_quantity: (Math.random()*100) >> 0,
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                rating: Math.random()*10,
                category: Math.max(1, (Math.random()*5) >> 0),
            });
            require("./model/Product.model").add(data);
        }
    }
});
