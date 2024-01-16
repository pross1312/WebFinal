const db = require("../module/database");
module.exports = {
    Product: class {
        constructor({ id, p_name, price, stockQuantity, category, description, image}) {
            if (id !== undefined) this.id = id;
            this.p_name = p_name;
            this.price = price;
            this.stockQuantity= stockQuantity;
            this.category = category;
            this.description = description;
            this.image = image;
        }
    },
    async update_stock(data) { // [{id, stock}, ...]
        if (Array.isArray(data)) {
            for (let {id, stock} of data) {
                await db.tx(async t => { // NOTE: faster
                    await t.none(`UPDATE "Products" SET "stockQuantity" = $1 WHERE id = $2`,
                        [Number(stock), id]);
                });
            }
        } else if (data !== undefined) {
            await db.none(`UPDATE "Products" SET "stockQuantity" = $1 WHERE id = $2`,
                [Number(data?.stock), data?.id]);
        } else throw new Error(`Missing arguments`);
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
        await db.add("Products", Object.keys(Array.isArray(product) ? product[0] : product), product);
    },
    async get(id) {
        try {
            if (id) {
                const result = await db.exec(
                    "one",
                    `SELECT pd.*, ct.name as category FROM "Products" pd LEFT JOIN "Category" ct ON ct.id = pd.category WHERE pd.id = ${id}`
                );
                return result ? new this.Product(result) : null;
            } else throw new Error("Missing arguments");
        } catch (err) {
            throw(err)
        }
    },
    async get_all() {
        const result = await db.exec(
            "manyOrNone",
            `SELECT pd.*, ct.name as category, ct.id as category_id FROM "Products" pd LEFT JOIN "Category" ct ON ct.id = pd.category`
        );
        console.log(result)
        if (!result) throw new CustomError( `Cant select data from "Products"`, 400, "");
        return result;
    },
    async getRelatedProducts(product) {
        try {
          if (product) {
            const result = await db.exec(
              "manyOrNone",
              `SELECT pd.* FROM "Products" pd 
               WHERE pd.category = 1 AND pd.id != ${product.id}`
            );
      
            if (!result) throw new CustomError( `Cant select data from "Products"`, 400, "");
            return result;
          } else {
            throw new Error("Missing arguments");
          }
        } catch (err) {
          throw err;
        }
      },

    async getByCategory(category){
        try {
            if (category) {
              const result = await db.exec(
                "manyOrNone",
                `SELECT pd.* FROM "Products" pd 
                 WHERE pd.category = ${category}`
              );
        
              if (!result) throw new CustomError( `Cant select data from "Products"`, 400, "");
              return result;
            } else {
              throw new Error("Missing arguments");
            }
          } catch (err) {
            throw err;
          }
    },

};
