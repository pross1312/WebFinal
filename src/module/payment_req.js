const fs = require("fs");
const https = require("https");
const { resolve } = require("path");
const cert = fs.readFileSync("./.ssl/ca.crt", {encoding: 'utf-8'});
const OPTION = {
    hostname: "localhost",
    port: process.env.PAYMENT_PORT,
    ca: [cert],
};
module.exports = {
    get: function(path) {
        return new Promise((resolve, reject) => {
            https.get({
                ...OPTION,
                method: "GET",
                path: path,
            }, (res) => {
                let data = [];
                res.setEncoding("utf-8");
                res.on("data", (chunk) => { data.push(chunk); });
                res.on("end", () => resolve({
                    code: res.statusCode,
                    data: data.join(""),
                }));
                res.on("error", err => reject(err));
            }).on("error", err => reject(err));
        });
    },
    post: function(path, data, headers) {
        return new Promise((resolve, reject) => {
            const req = https.request({
                ...OPTION,
                method: "POST",
                path: path,
                headers: headers || {
                    "Content-Type": "application/json",
                    "Content-Length": data?.length || 0,
                }
            }, res => {
                let data = [];
                res.setEncoding("utf-8");
                res.on("data", chunk => data.push(chunk));
                res.on("end", () => resolve({
                    code: res.statusCode,
                    data: data.join(""),
                }));
                res.on("error", err => reject(err));
            });
            req.on("error", (err) => {
                reject(err);
            })
            if (data) req.write(data, () => req.end());
            else req.end();
        });
    },
};

