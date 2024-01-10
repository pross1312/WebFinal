const payment_req = require("../module/payment_req");
module.exports = {
    async login(req, res, next) {
        const {email, password} = req.body;
        try {
            const response = await payment_req.post("/login", JSON.stringify({email, password}));
            console.log(response);
            if (response.code === 200) {
                const token = response.data;
                req.session.payment_access_token = token;
                res.redirect("/payment/order");
            } else {
                res.render("payment/login", {error: response.data});
            }
        } catch(err) {
            next(err);
        }
    }
};
