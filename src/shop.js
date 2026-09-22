const { ProductCatalog } = require("./catalog");
const { ShoppingCart } = require("./cart");
const { OrderService } = require("./order-service");

class VirtualGoodsShop {
  constructor({ products, orderService } = {}) {
    this.catalog = new ProductCatalog(products);
    this.cart = new ShoppingCart();
    this.orderService = orderService || new OrderService();
  }

  listProducts() {
    return this.catalog.listActive();
  }

  addToCart(productId, quantity = 1) {
    const product = this.catalog.getById(productId);
    if (!product || !product.active) {
      throw new Error(`active product ${productId} was not found`);
    }

    return this.cart.addProduct(product, quantity);
  }

  updateCartQuantity(productId, quantity) {
    return this.cart.updateQuantity(productId, quantity);
  }

  removeFromCart(productId) {
    return this.cart.removeProduct(productId);
  }

  viewCart() {
    return this.cart.toJSON();
  }

  checkout(customerEmail) {
    return this.orderService.createPendingOrder({
      cart: this.cart,
      customerEmail
    });
  }
}

module.exports = {
  VirtualGoodsShop
};
