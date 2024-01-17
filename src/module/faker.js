const { faker } = require("@faker-js/faker");
const OrderModel = require("../model/Order.model");
const AccountModel = require("../model/Account.model");
const bcrypt = require("bcrypt");
const UserModel = require("../model/User.model");
const private_pass = '$2b$10$9Nc8Lw0QOFgRJo.HCVjt5.kCIa3m3LpBVetXTVtnoDCN19ypICPzS' //123 
const payment_req = require("./payment_req");
module.exports = {
    generateOrders() {
        const orders = [];
        for (let i = 1; i <= 100; i++) {
            const order = {
                date: faker.date.past({ years: 5 }),
                cash: faker.finance.amount({ min: 1103, max: 13123 }),
            };
            orders.push(order);
        }
        return orders;
    },

    // return an array have 12 elements store cash of year
    cash_monthly(orders, year) {
        const filter_by_year = orders.filter(
            (order) => order.date.getFullYear() === year
        );
        return Array.from({ length: 12 }, (_, i) => i + 1).map((index) => {
            return filter_by_year
                .filter((order) => order.date.getMonth() + 1 === index)
                .reduce((sum, obj) => sum + parseFloat(obj.cash), 0);
        });
    },

    order_count_monthly(orders, year) {
        const filter_by_year = orders.filter(
            (order) => order.date.getFullYear() === year
        );
        return Array.from({ length: 12 }, (_, i) => i + 1).map((index) => {
            return filter_by_year.filter(
                (order) => order.date.getMonth() + 1 === index
            ).length;
        });
    },
    async generateMockData() {
        const emails = []
        for (let i = 1; i <= 100; i++) {
            let email = faker.internet.email();
            while(emails.includes(email)){ 
              email = faker.internet.email({firstName: Huy})
            }
            emails.push(email)
            const password = private_pass;
            const name = faker.person.fullName()
            const avatar = faker.image.avatarLegacy()  
            const type = "customer";
            const account = new AccountModel.Account({
                email,
                password,
                type,
            });
            await AccountModel.add(account)
            await UserModel.add(new UserModel.UserInfo({email, name, avatar}))
            const response = await payment_req.post("/register", JSON.stringify({
                email: email,
                password: "123",
            }));
            const order = new OrderModel.Order({
                email,
                ts: faker.date.past({ year: 5 }),
                products: [
                    {
                        id: faker.number.int({ min: 1, max: 20 }),
                        count: faker.number.int({ min: 1, max: 5 }),
                    },
                    {
                        id: faker.number.int({ min: 21, max: 56 }),
                        count: faker.number.int({ min: 1, max: 5 }),
                    },
                ],
            });
            await OrderModel.add(order);
        }
    },
};
