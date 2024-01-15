const { faker } = require('@faker-js/faker');

module.exports = { 
    generateOrders() {
        const orders = [];
        for (let i = 1; i <= 100; i++) {
          const order = {
            date: faker.date.past({years: 5}),
            cash: faker.finance.amount({ min: 1103, max: 13123 })
        };
          orders.push(order);
        }
        return orders;
      }, 

      // return an array have 12 elements store cash of year
    cash_monthly(orders, year){ 
        const filter_by_year = orders.filter(order => order.date.getFullYear() === year )
        return Array.from({ length: 12 }, (_, i) => i + 1).map(index => {
            return filter_by_year
              .filter(order => (order.date.getMonth() + 1) === index)
              .reduce((sum, obj) => sum + parseFloat(obj.cash), 0);
          });
    }, 

    order_count_monthly(orders, year){ 
        const filter_by_year = orders.filter(order => order.date.getFullYear() === year )
        return Array.from({ length: 12 }, (_, i) => i + 1).map(index => {
            return filter_by_year
              .filter(order => (order.date.getMonth() + 1) === index)
              .length
          });
    }
}