require("dotenv").config();
const fs = require("fs");
const https = require("https");
const path = require("path");
const db = require("../src/module/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const express = require("express");
const app = express();
const PORT = process.env.PAYMENT_PORT || 9999;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

app.post("/google-login", async (req, res, next) => {
    const {access_token} = req.body;
    if (access_token === undefined) {
        res.status(400).send("Missing access token");
    } else {
        const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`;
        const response = await fetch(url);
        const acc = await response.json();
        if (res.status === 200) {
            const jwt_token = jwt.sign(JSON.stringify(acc.email), JWT_SECRET);
            res.status(200).send(jwt_token);
        } else {
            res.status(response.status).send(await response.text());
        }
    }
});

app.post("/login", async (req, res, next) => {
    const {email, password} = req.body;
    if (email === undefined || password === undefined) {
        res.status(400).send("Missing authentication");
    } else try {
        const acc = await db.exec("one", `SELECT * FROM "PaymentAccount" WHERE email = $1`, email);
        if (acc === null) {
            res.status(400).send("Email not found");
        } else if (acc.password === null) { // NOTE: google account, use google-login api
            res.status(400).send("Incorrect email or password");
        } else if (bcrypt.compareSync(password, acc.password)) {
            const jwt_token = jwt.sign(JSON.stringify(acc.email), JWT_SECRET);
            res.status(200).send(jwt_token);
        } else {
            res.status(400).send("Incorrect email or password");
        }
    } catch(err) {
        next(err);
    }
});

app.post("/register", async (req, res, next) => {
    const {email, password} = req.body;
    const INIT_BALANCE = Number(process.env.INIT_BALANCE);
    if (email === undefined || password === undefined) {
        res.status(400).send("Missing authentication");
    } else try {
        const hashed_pass = bcrypt.hashSync(password, Number(process.env.SALT) || 10);
        await db.add("PaymentAccount", ["email", "password", "balance"], {
            email,
            password: hashed_pass,
            balance: INIT_BALANCE
        });
        res.status(200).send("OK");
    } catch(err) {
        next(err);
    }
});

app.post("/order/create", (req, res, next) => {
});

const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, "..", ".ssl", "ca.key")),
    cert: fs.readFileSync(path.join(__dirname, "..", ".ssl", "ca.crt")),
}, app);

server.listen(PORT, () => {
    console.log("Authentication server started on", PORT);
});