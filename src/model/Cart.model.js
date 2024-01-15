const CustomError = require('../module/CustomErr');
const db = require('../module/database');
const ProductModel = require("./Product.model");


module.exports = {
    Cart: class {
        constructor({ email, products }) {
            this.email = email;
            this.products = products || []; // {...{product-info}, count}
        }
    },
    async add(email, product_id, count) { // NOTE: add 1 product to cart
        if (email && product_id && count) {
            const product = await ProductModel.get(product_id);
            if (product === null) {
                throw new CustomError(`Product with id ${product_id} not existed`, 400);
            }
            if (Number(product.stockQuantity) < Number(count)) {
                throw new CustomError("Amount exceed stock", 400);
            }
            const data = await db.exec("oneOrNone", `SELECT * FROM "Cart" WHERE email = $1 AND product = $2`,
                [email, product_id]);
            if (data != null) {
                // TODO: handle this case
                throw new CustomError("Product is already in cart", 400, "");
            }
            await db.add("Cart", ["email", "product", "count"], {
                email, product: product_id, count
            });
        } else throw new Error('Missing arguments');
    },
    async get(email) {
        if (email) {
            const result = await db.exec(
                'manyOrNone',
                `SELECT * FROM "Cart" WHERE email = $1`,
                [email]
            );
            const promises = result.map(async x => {
                return {...await ProductModel.get(x.product), count: x.count};
            });
            const products = await Promise.all(promises);
            return new this.Cart({email, products});
        } else throw new Error('Missing arguments');
    },
    async clear(email) {
        if (email) {
            await db.exec(
                'any',
                `DELETE FROM "Cart" WHERE email = $1`,
                [email]
            );
        } else throw new Error('Missing arguments');
    }
};

