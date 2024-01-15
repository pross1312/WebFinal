const db = require("../module/database");
const CustomError = require("../module/CustomErr");
require('dotenv').config()
const path = require('path')
const product_image_folder = process.env.PRODUCT_IMAGE_FOLDER
const fs = require('fs')
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

    async get(tb_name, condition){ 
        try{ 
            return await db.find(tb_name, condition)
        }
        catch(err){ 
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
            return db.delete('Products', `id = '${productId}'`)
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

    async getCategory(condition){ 
        try{ 
            return await db.find('Category', condition)
        }
        catch(err){ 
            throw(err)    
        }
    }, 
    async deleteCategory(id){ 
        try{ 
            const ref_category = await db.find("Category", ` parent_id = '${id}'`)
            if(ref_category && ref_category.length > 0){ 
                console.log(ref_category);
                return null 
            }
            return await db.delete("Category", ` id = '${id}' RETURNING *`)
        }
        catch(err){ 
            throw(err)  
        }
    }, 

    async addCategory(categoryObj){ 
        try{ 
            if(categoryObj.parent_id === "-1"){ 
                return await db.exec("one", `INSERT INTO "Category"(name) VALUES($1) RETURNING id`,
                    categoryObj.name, c => +c.id);
            }
            else if(categoryObj.parent_id !== "-1"){  
                return await db.exec("one", `INSERT INTO "Category"(name, parent_id) VALUES($1, $2) RETURNING id`,
                    [categoryObj.name, categoryObj.parent_id], c => +c.id);
            }
        }
        catch(err){ 
            throw(err)
        }
    }, 

    async updateCategory(categoryObj){ 
        try{ 
            if(categoryObj.parent_id === "-1"){ 
                await db.update("Category", ` name = '${categoryObj.name}'` , ` id = '${categoryObj.id}'`)
            }
            else if(categoryObj.parent_id !== "-1"){  
                await db.update("Category", ` name = '${categoryObj.name}', parent_id = '${categoryObj.parent_id}'` , ` id = '${categoryObj.id}'`)
            }
        }
        catch(err){ 
            throw(err)
        }
    }
};
