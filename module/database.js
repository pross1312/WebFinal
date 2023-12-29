const fs = require("fs");
const pgp = require("pg-promise")({
    capSQL: true,
});

const DB_NAME = "webfinal";

const cn = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: DB_NAME,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    max: 30,
};
const db = pgp(cn);

module.exports = {
    async init_if_not_exist(file_path) {
        let conn = null;
        try {
            const root = pgp({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                password: process.env.DB_PASS,
                user: process.env.DB_USER,
                max: 30,
            });
            conn = await root.connect();
            const result = await conn.query(`SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'`);
            if (result.length == 0) { // no db founddb
                console.log(`[INFO] No database '${DB_NAME}' found, create one from '${file_path}'`);
                await conn.any(`CREATE DATABASE ${DB_NAME}`);
                await conn.done();
                conn = await db.connect();
                await conn.none(fs.readFileSync(file_path, {encoding: "utf-8"}));
            } else {
                console.log(`[INFO] Database '${DB_NAME}' found`);
            }
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.done();
        }
    },
    // NOTE: func: [one, none, ...] check pg-promise connection for more information
    async exec(func, sql) {
        if (!func || !sql) throw new Error("Missing arguments");
        let conn = null;
        try {
            conn = await db.connect();
            await conn[func](sql);
        } catch(err) {
        } finally {
            if (conn) conn.done();
        }
    },
    async add(table, keys, obj) {
        const sql = pgp.helpers.insert(obj, keys, table);
        await this.exec("none", sql);
    },
};
