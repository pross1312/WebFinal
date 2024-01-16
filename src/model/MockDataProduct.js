const { products } = require('../module/mockdatabase');

class ProductModel {
  getAllProducts() {
    return products;
  }

  getByID(id) {
    const product = products.find(product => product.id === Number(id))
    return product
  }

  getPerPage(index1, index2){
    return products.slice(index1, index2)
  }

  getNumberOfProducT(){
    return products.length
  }
}

module.exports = new ProductModel();