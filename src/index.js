require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const ws = require("ws");
const path = require("path");
const PORT = process.env.PORT || 1234;
const payment_req = require("./module/payment_req");
const CustomError = require("./module/CustomErr");
const product_data = require("./module/database");
// config
app.use("/resources", express.static(path.join(__dirname, "resources")));
app.use("/image", express.static(path.join(__dirname, "resources", "productImages")));
app.use("/icon", express.static(path.join(__dirname, "resources", "icons")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const session_handler = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
})
app.use(session_handler);

require("./config/passport-config")(app);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// -----

app.use((req, res, next) => {
    console.log("[INFO] %s %s", req.method, req.path);
    console.log("[INFO]", req.session);
    next();
});

app.use("/auth", require("./route/auth.route"));

app.use((req, res, next) => {
    // authentication guard
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/auth/login");
    }
});

app.use('/payment', require('./route/payment.route'));
app.use((req, res, next) => { // NOTE: payment_access_token should not be allowed to pass payment route
    if (req.session.payment_access_token) delete req.session.payment_access_token;
    next();
});

app.use('/user', require('./route/userRoute'));

app.get('/', (req, res) => {
    let array = new Array(10);
    array.fill({role: "admin", text: "hello motherf jeqwoie jioqwje oucker"});
    array = array.concat(new Array(10).fill({role: "customer", text: "hello motherf jeqwoie jioqwje oucker"}))
                 .sort(() => (Math.random() > .5) ? 1 : -1);
    if (req.user?.type === "customer") {
        res.redirect("/user");
    } else if (req.user?.type === "admin") {
        res.redirect("/admin");
    } else {
        next(new Error("Invalid type " + req.user?.type));
    }
});

app.use("/customer", (req, res, next) => {
    if (req.user?.type === "customer") {
        next();
    } else {
        res.redirect("/");
    }
}, require("./route/customer.route"));

const ensureAuthorization = (req, res, next) => {
    if (req.user?.type === "admin") {
        next();
    } else {
        res.redirect("/");
    }
};

app.use("/admin", ensureAuthorization, require("./route/admin.R"));

app.use((req, res, next) => {
    next(
        new CustomError(
            "Page not found",
            404,
            `The page ${req.path} you're looking for does not exist`
        )
    );
});

app.use((err, req, res, next) => {
    // guard exception
    console.log(err);
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    const msg =
        err instanceof CustomError ? err.message : "Internal server error";
    const desc =
        err instanceof CustomError ? err.desc : err;
    res.status(statusCode).render("error", {
        statusCode,
        msg,
        desc,
    });
});


// have fun when use PORT -_- 😏
const reset = "\x1b[0m";
const cyan = "\x1b[96m";
const underline = "\x1b[4m";
const server = app.listen(13123, async () => {
    console.log(`${cyan}${underline}App running at: http://localhost:${PORT}${reset}`);
    const init = await require('./module/database').init_if_not_exist('./init.sql');
    if (init) { // NOTE: init random data here
        for (var i = 0; i < 50; i++) {
            const data = new (require("./model/Product.model").Product)({
                p_name: "Random",
                price: Math.random()*10000,
                stockQuantity: (Math.random()*100) >> 0,
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                category: Math.max(1, (Math.random()*3) >> 0),
                image: "https://picsum.photos/200"
            });
            require("./model/Product.model").add(data);
        }
    }
});
const ws_server = new ws.Server({noServer: true});
ws_server.on("connection", (socket, req) => {
    req.user = req?.session?.passport?.user;
    if (!req.user) {
        socket.close();
    } else {
        require("./route/socket.route")(socket, req);
    }
});
server.on("upgrade", (req, sock, head) => {
    session_handler(req, {}, () => {
        ws_server.handleUpgrade(req, sock, head, (socket) => {
            console.log("Got connection");
            ws_server.emit("connection", socket, req);
        });
    });
});
