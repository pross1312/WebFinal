const OrderModel = require("../model/Order.model");
const { Order } = require("../model/Order.model");
const payment_req = require("../module/payment_req");
const ProductModel = require("../model/Product.model");
const {TimeoutMap, TimeoutError} = require("../module/TimeoutMap");
const unconfirmed_transaction = new TimeoutMap();
const unconfirmed_order = new TimeoutMap();
module.exports = {
    async login(req, res, next) {
        const {email, password} = req.body;
        try {
            const response = await payment_req.post("/login", JSON.stringify({email, password}));
            if (response.code === 200) {
                const token = response.data;
                req.session.payment_access_token = token;
                res.status(200).send("OK");
            } else {
                res.status(400).send(response.data);
            }
        } catch(err) {
            next(err);
        }
    },
    async google_login(req, res, next) {
    },
    async create_order(req, res, next) {
        const cart = req.body;
        let amount = 0;
        try {
            const promises = cart.map(async x => {
                return {
                    ...await ProductModel.get(x.id),
                    count: x.count,
                };
            });
            const products = await Promise.all(promises);
            const order = new Order({
                email: req.user?.email,
                products,
            });
            unconfirmed_order.put(req.user?.email, order, 10*60*1000); // NOTE: automatically remove unconfirmed transaction after 10 mins
            res.render("payment/confirm-order", {
                order: order,
            });
        } catch(err) {
            next(err);
        }
    },
    async confirm_order(req, res, next) {
        const {order_id} = req.params;
        try {
            const order = unconfirmed_order.get(req.user?.email);
            if (order == null) {
                res.redirect("/");
                return;
            }
            let sum = 0;
            for (var product of order.products) {
                const product_data = await ProductModel.get(product.id);
                if (product_data !== null) {
                    sum += Number(product_data.price) * Number(product.count);
                } else {
                    console.log("ERROR", product.id);
                }
            }
            const transaction = {
                initiator: req.user?.email,
                receiver: "admin@gmail.com",
                amount: sum,
                description: "Test order"
            };
            unconfirmed_transaction.put(req.user?.email, transaction, 10*60*1000);
            res.render("payment/confirm-payment", {
                transaction
            });
        } catch(err) {
            if (err instanceof TimeoutError) {
                res.status(400).send("Time out, please try again");
            } else {
                next(err);
            }
        }
    },
    async confirm_transaction(req, res, next) {
        try {
            const order = unconfirmed_order.pop(req.user?.email);
            if (order == null) {
                res.redirect("/");
                return;
            }
            order.ts = new Date();
            await OrderModel.add(order);
            const transaction = unconfirmed_transaction.pop(req.user?.email);
            transaction.ts = new Date();
            const json_transaction = JSON.stringify(transaction);
            const response = await payment_req.post("/transaction/create", json_transaction, {
                "Content-Type": "application/json",
                "Content-Length": json_transaction.length,
                "Authorization": req.session.payment_access_token,
            });
            delete req.session.payment_access_token;
            if (response.code !== 200) {
                res.redirect("/");
            } else {
                res.render("payment/payment-successful");
            }
        } catch(err) {
            if (err instanceof TimeoutError) {
                res.status(400).send("Time out, please try again");
            } else {
                next(err);
            }
        }
    }
};
