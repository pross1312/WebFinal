const db = require("../module/database");
const ProductModel = require("./Product.model");

module.exports = {
    Order: class {
        constructor({ email, ts, products }) {
            this.email = email;
            this.ts = ts;
            this.products = products || []; // {id, count}
        }
    },
    async add(order) {
        let data = null;
        const id = await this.next_id();
        if (
            Array.isArray(order) &&
            order.length > 0 &&
            order[0] instanceof this.Order
        ) {
            const temp = order.map((x) =>
                x.products.map((y) => {
                    return {
                        id: id,
                        email: x.email,
                        ts: x.ts,
                        product: y.id,
                        count: y.count,
                    };
                })
            );
            data = [];
            for (row of temp) for (e of row) data.push(e);
        } else if (order instanceof this.Order) {
            data = order.products.map((x) => {
                return {
                    id: id,
                    email: order.email,
                    ts: order.ts,
                    product: x.id,
                    count: x.count,
                };
            });
        } else throw new Error("Unexpected");
        if (data.length > 0) {
            await db.add(
                "Order",
                Object.keys(Array.isArray(data) ? data[0] : data),
                data
            );
            return id;
        }
    },
    async get(order_id) {
        if (order_id) {
            const result = await db.exec(
                "many",
                `SELECT * FROM "Order" WHERE id = '${order_id}'`
            );
            const { id, email, ts } = result[0];
            const products = result.map((x) => {
                return { id: x.product, count: x.count };
            });
            return new this.Order({ email, ts, id, products });
        } else throw new Error("Missing arguments");
    },
    async next_id() {
        const id =
            Number(
                (
                    await db.exec(
                        "oneOrNone",
                        `SELECT max(id) as id FROM "Order"`
                    )
                ).id
            ) || 0;
        return id + 1;
    },

    async get_cash_monthly_in_year(year) {
        try {
            return await db.exec(
                "any",
                `WITH MonthSeries AS (
                SELECT generate_series(1, 12) AS month
            )
            SELECT 
                ms.month AS month,
                COALESCE(SUM(pd.price * od.count), 0) AS total
            FROM 
                MonthSeries ms
            LEFT JOIN 
                "Order" od ON ms.month = DATE_PART('month', od.ts) AND DATE_PART('YEAR', od.ts) = ${year}
            LEFT JOIN 
                "Products" pd ON od.product = pd.id
            GROUP BY 
                ms.month
            ORDER BY 
                ms.month ASC;`
            );
        } catch (err) {
            throw err;
        }
    },

    async get_order_count_monthly_in_year(year) {
        try {
            return await db.exec(
                "any",
                `WITH MonthSeries AS (
                SELECT generate_series(1, 12) AS month
            )
            SELECT 
                ms.month AS month,
                COUNT(distinct od.id) AS total
            FROM 
                MonthSeries ms
            LEFT JOIN 
                "Order" od ON ms.month = DATE_PART('month', od.ts) AND DATE_PART('YEAR', od.ts) = ${year}
            GROUP BY 
                ms.month
            ORDER BY 
                ms.month ASC;`
            );
        } catch (err) {
            throw err;
        }
    },
    async delete(email) {
        if (!email) return;
        try {
            return await db.delete("Order", ` email = '${email}'`);
        } catch (err) {
            throw err;
        }
    },
    async remove_product(product_id) {
        if (!product_id) return;
        try {
            return await db.update("Order",` product = '${-1}'`, ` product = '${product_id}'`);
        } catch (err) {
            throw err;
        }
    },
};
