const bcrypt = require("bcrypt");
const OrderModel = require("../model/Order.model");
const AccountModel = require("../model/Account.model");
const { Order } = require("../model/Order.model");
const payment_req = require("../module/payment_req");
const ProductModel = require("../model/Product.model");
const {TimeoutMap, TimeoutError} = require("../module/TimeoutMap");
const CustomError = require("../module/CustomErr");
const CartModel = require("../model/Cart.model");
const { sendEmail } = require("../module/utils");
const unconfirmed_transaction = new TimeoutMap();
const unconfirmed_order = new TimeoutMap();
module.exports = {
    async login(req, res, next) {
        const {password} = req.body;
        try {
            const response = await payment_req.post("/login", JSON.stringify({email: req.user?.email, password}));
            if (response.code === 200) {
                const token = response.data;
                req.session.payment_access_token = token;
                res.redirect("/payment/create-order");
            } else {
                res.render("payment/login", {email: req.user?.email, error: response.data});
            }
        } catch(err) {
            next(err);
        }
    },
    // NOTE: this is for google-account (until i think of a better way)
    async register(req, res, next) {
        const {password} = req.body;
        if (!password) {
            res.render('payment/register', {error: "Can't load your data"});
            return;
        }
        try {
            let acc = await AccountModel.get(req.user?.email);
            if (acc === null) {
                next(new CustomError("Should not allow user access this page if their main account is not existed"));
            } else if (acc.password) {
                res.render('payment/register', {
                    error: "Payment account existed, please login with your main account.",
                    email: req.user?.email,
                });
                return;
            }
            // salt 10
            const hashedPassword = await bcrypt.hash(
                password,
                !isNaN(process.env.SALT) ? Number(process.env.SALT) : 10
            );

            const response = await payment_req.post("/register", JSON.stringify({
                email: req.user?.email,
                password
            }));
            if (response.code === 200) {
                res.redirect('/payment/create-order');
            } else {
                res.render("payment/register", {
                    error: response.data,
                    email: req.user?.email,
                });
            }
        } catch (err) {
            next(err);
        }
    },
    async google_login(req, res, next) {
    },
    async create_order(req, res, next) {
        try {
            const cart = await CartModel.get(req.user?.email);
            // if (cart.products.length === 0) { // TODO: report error
            // } else {
                const amount = cart.products.reduce((acc, cur) => acc + Number(cur.count)*Number(cur.price), 0)
                const order = new Order(cart);
                unconfirmed_order.put(req.user?.email, order, 10*60*1000); // NOTE: automatically remove unconfirmed transaction after 10 mins
                res.render("payment/create-order", {
                    order: order,
                    amount
                });
            // }
        } catch(err) {
            next(err);
        }
    },
    async confirm_order(req, res, next) {
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
                transaction, error: null,
            });
        } catch(err) {
            if (err instanceof TimeoutError) {
                next(new CustomError("Time out, please try again", 400));
            } else {
                next(err);
            }
        }
    },
    async cancel_order(req, res, next) {
        if (req.session.payment_access_token) delete req.session.payment_access_token;
        unconfirmed_order.pop(req.user?.email);
        res.redirect("/");
    },
    async confirm_transaction(req, res, next) {
        try {
            const order = unconfirmed_order.pop(req.user?.email);
            if (order == null) {
                res.redirect("/");
                return;
            }
            order.ts = new Date();
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
                const obj = JSON.parse(response.data);
                if (obj.error) {
                    res.render("payment/confirm-payment", { // TODO: render home instead
                        transaction, error: obj.error,
                    });
                } else {
                    await OrderModel.add(order);
                    await CartModel.clear(req.user?.email);
                    const data = order.products.map(x => {return {
                        id: x.id,
                        stock: Number(x.stockQuantity) - Number(x.count)
                    }});
                    await ProductModel.update_stock(data);
                    res.render("payment/payment-successful");
                    req.app.render("transaction_notification", {transaction: obj.data}, async (err, html) => {
                        if (err) console.log(err);
                        else try {
                            await sendEmail(
                                process.env.EMAIL_USERNAME,
                                process.env.EMAIL_PASSWORD, req.user?.email, "Transaction",
                                html,
                            );
                        } catch(err) {
                            console.log(err);
                        }
                    });
                }
            }
        } catch(err) {
            if (err instanceof TimeoutError) {
                next(new CustomError("Time out, please try again", 400));
            } else {
                next(err);
            }
        }
    },
    async cancel_transaction(req, res, next) {
        if (req.session.payment_access_token) delete req.session.payment_access_token;
        unconfirmed_order.pop(req.user?.email);
        unconfirmed_transaction.pop(req.user?.email);
        res.redirect("/");
    },
};
