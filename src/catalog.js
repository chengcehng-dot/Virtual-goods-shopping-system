const DEFAULT_PRODUCTS = [
  {
    id: "avatar-frame-sunset",
    name: "Sunset Avatar Frame",
    description: "A warm sunset frame for a user's profile avatar.",
    priceCents: 990,
    currency: "CNY",
    category: "avatar-decoration",
    active: true
  },
  {
    id: "chat-bubble-neon",
    name: "Neon Chat Bubble",
    description: "A bright animated-style chat bubble skin.",
    priceCents: 1290,
    currency: "CNY",
    category: "chat-decoration",
    active: true
  },
  {
    id: "starter-coins-100",
    name: "100 Starter Coins",
    description: "A simulated virtual currency pack for local development.",
    priceCents: 500,
    currency: "CNY",
    category: "virtual-currency",
    active: true
  }
];

function cloneProduct(product) {
  return { ...product };
}

class ProductCatalog {
  constructor(products = DEFAULT_PRODUCTS) {
    this.products = new Map(
      products.map((product) => [product.id, cloneProduct(product)])
    );
  }

  listActive() {
    return [...this.products.values()]
      .filter((product) => product.active)
      .map(cloneProduct);
  }

  getById(productId) {
    const product = this.products.get(productId);
    return product ? cloneProduct(product) : null;
  }
}

module.exports = {
  DEFAULT_PRODUCTS,
  ProductCatalog
};
