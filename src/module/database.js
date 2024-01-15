const fs = require("fs");
const pgp = require("pg-promise")({
    capSQL: true,
});
let QRE = pgp.errors.QueryResultError;
let qrec = pgp.errors.queryResultErrorCode;

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
            const result = await conn.query(
                `SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'`
            );
            if (result.length == 0) {
                // no db founddb
                console.log(
                    `[INFO] No database '${DB_NAME}' found, create one from '${file_path}'`
                );
                await conn.any(`CREATE DATABASE ${DB_NAME}`);
                await conn.done();
                conn = await db.connect();
                await conn.none(
                    fs.readFileSync(file_path, { encoding: "utf-8" })
                );
                return true;
            } else {
                console.log(`[INFO] Database '${DB_NAME}' found`);
                return false;
            }
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.done();
        }
    },
    // NOTE: func: [one, none, ...] check pg-promise connection for more information
    async exec(func, sql, args) {
        if (!func || !sql) throw new Error("Missing arguments");
        let conn = null;
        try {
            conn = await db.connect();
            return await conn[func](sql, args);
        } catch (err) {
            if (err instanceof QRE && err.code === qrec.noData) {
                return null;
            } else {
                throw err;
            }
        } finally {
            if (conn) conn.done();
        }
    },
    async add(table, keys, obj) {
        const sql = pgp.helpers.insert(obj, keys, table);
        await this.exec("none", sql);
    },

    async all(tb_name) {
        try {
            return await this.exec('any', `SELECT * FROM "${tb_name}"`, []);
        } catch (err) {
            throw err;
        }
    }, 
    async delete(tb_name,condition){ 
        try{ 
            return await this.exec('one', `DELETE FROM "${tb_name}" WHERE ${condition}`)
        }
        catch(err){ 
            throw(err)
        }
    }, 

    async find(tb_name, condition){ 
        try{ 
            return await this.exec('any', `SELECT * FROM "${tb_name}" WHERE ${condition}`)
        }
        catch(err){ 
            throw(err)
        }
    }, 
    async update(tb_name, update, condition){ 
        try{ 
            return await this.exec('any', `UPDATE "${tb_name}" SET ${update}  WHERE ${condition}`)
        }  
        catch(err){ 
            throw(err)
        }
    }, 
    async getMax(tb_name, key){ 
        try{ 
            return await this.exec('one', `SELECT * from "${tb_name}" ORDER BY ${key} desc limit 1`)
        }
        catch(err){ 
            throw(err)
        }
    } 
};
