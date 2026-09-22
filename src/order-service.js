const { randomUUID } = require("node:crypto");

class OrderService {
  constructor({ idFactory = randomUUID, clock = () => new Date() } = {}) {
    this.idFactory = idFactory;
    this.clock = clock;
  }

  createPendingOrder({ cart, customerEmail }) {
    if (!customerEmail || !customerEmail.includes("@")) {
      throw new Error("a valid customerEmail is required");
    }

    if (cart.isEmpty()) {
      throw new Error("cannot create an order from an empty cart");
    }

    const createdAt = this.clock().toISOString();
    const snapshot = cart.toJSON();

    return {
      id: this.idFactory(),
      status: "PENDING_PAYMENT",
      customerEmail,
      createdAt,
      currency: snapshot.currency,
      items: snapshot.items,
      totalQuantity: snapshot.totalQuantity,
      subtotalCents: snapshot.subtotalCents,
      totalCents: snapshot.subtotalCents
    };
  }
}

module.exports = {
  OrderService
};
