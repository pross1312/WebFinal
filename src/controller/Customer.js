const ChatModel = require("../model/Chat.model");
const SocketModel = require("../model/Socket.model");
const active_customers = {};
const CartModel = require('../model/Cart.model');
const CustomError = require("../module/CustomErr");
module.exports = {
    async list_chat(req, res, next) {
        try {
            const chat = await ChatModel.list(req.user?.email);
            res.status(200).setHeader("Content-Type", "application/json")
                           .send(JSON.stringify(chat));
        } catch(err) {
            next(err);
        }
    },
    async send_chat(req, res, next) {
        const {content} = req.body;
        if (content === undefined) {
            res.status(400).send("Missing content");
        } else try {
            await ChatModel.add(new ChatModel.ChatMessage({role: "customer", content, email: req.user?.email}));
            const admin_sock = SocketModel.get("admin");
            if (admin_sock !== undefined) {
                admin_sock.send(`[MSG] [${req.user?.email}]${content}`);
            }
            res.status(200).send("OK");
        } catch(err) {
            next(err);
        }
    },

    async get_cart(req, res, next) {
        const email = req.user?.email
        if(!email)
            next(new CustomError("Please try again"), 500)
        try{ 
            const data = await CartModel.get(email)
            if(!data || data.length === 0){ 
                next(new CustomError("Please try again"), 500)
            }
            const items = data.products.length
            const total = parseFloat(data.products.reduce((sum, product) => sum + (parseFloat(product.price) * product.count), 0)).toFixed(2)
            res.status(200).render('user/cart', {email, products: data.products, items, total})
        }
        catch(err){ 
            next(err)
        }
    },

    async delete_cart(req, res, next){ 
        const email = req?.user?.email
        const {id} = req.body 
        if(!email || !id)
            next(new CustomError("Missing arguments", 400))
        try{ 
            await CartModel.delete_product(email, id)
            return res.status(200).send('Removed product')
        }
        catch(err){ 
            next(err)
        }
    }, 
    async add_to_cart(req,res, next){ 
        const email = req?.user?.email
        const {id, count} = req.body 
        if(!email || !id || !count)
            next(new CustomError("Missing arguments", 400))
        try{ 
            await CartModel.add(email, id, count)
            return res.status(200).send('Added product')
        }
        catch(err){ 
            next(err)
        }
    },

    async decrease_cart(req, res, next){ 
        const email = req?.user?.email
        const {id} = req.body 
        if(!email || !id)
            next(new CustomError("Missing arguments", 400))
        try{ 
            await CartModel.decrease_cart(email, id)
            return res.status(200).send('Added product')
        }
        catch(err){ 
            next(err)
        }
    }
};
