const db = require("../module/database");
const CustomError = require("../module/CustomErr");
module.exports = {
    async getAll(tb_name) {
        try {
            const result = await db.all(tb_name);
            if (!result)
                throw new CustomError(
                    `Cant select data from ${tb_name}`,
                    400,
                    ""
                );
            return result;
        } catch (err) {
            throw err;
        }
    },

    async update(tb_name, condition, update) {
        try{ 
            await db.update(tb_name, update, condition)
        }
        catch(err){ 
            throw(err)
        }
    },

    async add(tb_name, obj) {
       try{ 
        db.add(
            tb_name,
            [
                'p_name',
                'category',
                'price',
                'stockQuantity',
                'description',
                'image',
            ],
            obj
        );
       }
       catch(err){ 
            throw(err)
       }
    },

    async deleteProduct(productId){ 
        try{ 
            db.delete('Products', `id = '${productId}'`)
        }
        catch(err){
            throw(err)
        }
    },

    async getLastIdProduct() {
        try {
            return await db.getMax("Products", "id");
        } catch (err) {
            throw err;
        }
    },
};
