require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const PORT = process.env.PORT || 1234;
const payment_req = require("./module/payment_req");
const CustomError = require("./module/CustomErr");
// config
app.use("/resources", express.static(path.join(__dirname, "resources")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

require("./config/passport-config")(app);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// -----

app.use((req, res, next) => {
    console.log("[INFO] %s", req.path);
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

app.use("/payment", require("./route/payment.route"));
app.get("/", (req, res) => {
    if (req.user?.type === "customer") {
        res.render("user/homepage");
    } else if (req.user?.type === "admin") {
        res.redirect("/admin");
    } else {
        next(new Error("Invalid type " + req.user?.type));
    }
});

const ensureAuthorization = (req, res, next) => {
    // TODO Check Account type
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
            "The page you're looking for does not exist"
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

// have fun when use PORT
const reset = "\x1b[0m";
const cyan = "\x1b[96m";
const underline = "\x1b[4m";
app.listen(13123, async () => {
    console.log(
        `${cyan}${underline}App running at: http://localhost:${PORT}${reset}`
    );
    await require("./module/database").init_if_not_exist("./init.sql");
});
