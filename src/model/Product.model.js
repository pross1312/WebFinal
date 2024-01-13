const db = require("../module/database");
module.exports = {
    Product: class {
        constructor({ id, name, price, stock_quantity, category, description, rating}) {
            if (id !== undefined) this.id = id;
            this.name = name;
            this.price = price;
            this.stock_quantity = stock_quantity;
            this.category = category;
            this.description = description;
            this.rating = rating;
        }
    },
    async add(product) {
        if (
            (Array.isArray(product) &&
                product.length == 0 &&
                !(product[0] instanceof this.Product)) ||
            !(product instanceof this.Product)
        ) {
            throw new Error("Invalid arguments type");
        }
        await db.add("Product", Object.keys(Array.isArray(product) ? product[0] : product), product);
    },
    async get(id) {
        try {
            if (id) {
                const result = await db.exec(
                    "one",
                    `SELECT pd.*, ct.name as category FROM "Product" pd LEFT JOIN "Category" ct ON ct.id = pd.category WHERE pd.id = ${id}`
                );
                return result ? new this.Product(result) : null;
            } else throw new Error("Missing arguments");
        } catch (err) {
            throw(err)
        }
    },
};
