const db = require("../module/database");
const CustomError = require('../module/CustomErr')
module.exports = {
    async getAll(tb_name) {
        try {
            const result = await db.all(tb_name); 
            if (!result) throw new CustomError(`Cant select data from ${tb_name}`, 400, "");
            return result
        } catch (err) {
            throw err;
    }
    },

};
