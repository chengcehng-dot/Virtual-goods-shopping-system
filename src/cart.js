class ShoppingCart {
  constructor() {
    this.items = new Map();
  }

  addProduct(product, quantity = 1) {
    this.assertPositiveInteger(quantity, "quantity");

    const existingItem = this.items.get(product.id);
    const nextQuantity = (existingItem?.quantity || 0) + quantity;

    this.items.set(product.id, {
      productId: product.id,
      name: product.name,
      unitPriceCents: product.priceCents,
      currency: product.currency,
      quantity: nextQuantity
    });

    return this.getItem(product.id);
  }

  updateQuantity(productId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error("quantity must be a non-negative integer");
    }

    if (quantity === 0) {
      this.items.delete(productId);
      return null;
    }

    const item = this.items.get(productId);
    if (!item) {
      throw new Error(`product ${productId} is not in the cart`);
    }

    item.quantity = quantity;
    return this.getItem(productId);
  }

  removeProduct(productId) {
    return this.items.delete(productId);
  }

  getItem(productId) {
    const item = this.items.get(productId);
    return item ? { ...item } : null;
  }

  getItems() {
    return [...this.items.values()].map((item) => ({ ...item }));
  }

  getTotalQuantity() {
    return this.getItems().reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotalCents() {
    return this.getItems().reduce(
      (total, item) => total + item.unitPriceCents * item.quantity,
      0
    );
  }

  isEmpty() {
    return this.items.size === 0;
  }

  toJSON() {
    return {
      items: this.getItems(),
      totalQuantity: this.getTotalQuantity(),
      subtotalCents: this.getSubtotalCents(),
      currency: this.getItems()[0]?.currency || "CNY"
    };
  }

  assertPositiveInteger(value, fieldName) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(`${fieldName} must be a positive integer`);
    }
  }
}

module.exports = {
  ShoppingCart
};
