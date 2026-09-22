const assert = require("node:assert/strict");
const test = require("node:test");

const { ShoppingCart } = require("../src/cart");
const { OrderService } = require("../src/order-service");
const { VirtualGoodsShop } = require("../src/shop");

test("lists only active products with prices represented in cents", () => {
  const shop = new VirtualGoodsShop({
    products: [
      {
        id: "active",
        name: "Active product",
        description: "Visible product",
        priceCents: 125,
        currency: "CNY",
        category: "test",
        active: true
      },
      {
        id: "inactive",
        name: "Inactive product",
        description: "Hidden product",
        priceCents: 999,
        currency: "CNY",
        category: "test",
        active: false
      }
    ]
  });

  assert.deepEqual(shop.listProducts().map((product) => product.id), ["active"]);
  assert.equal(shop.listProducts()[0].priceCents, 125);
});

test("adding the same product merges quantities and calculates the subtotal", () => {
  const shop = new VirtualGoodsShop();

  shop.addToCart("avatar-frame-sunset", 2);
  shop.addToCart("avatar-frame-sunset", 1);
  shop.addToCart("starter-coins-100", 2);

  assert.deepEqual(shop.viewCart(), {
    items: [
      {
        productId: "avatar-frame-sunset",
        name: "Sunset Avatar Frame",
        unitPriceCents: 990,
        currency: "CNY",
        quantity: 3
      },
      {
        productId: "starter-coins-100",
        name: "100 Starter Coins",
        unitPriceCents: 500,
        currency: "CNY",
        quantity: 2
      }
    ],
    totalQuantity: 5,
    subtotalCents: 3970,
    currency: "CNY"
  });
});

test("updating quantity to zero removes an item", () => {
  const shop = new VirtualGoodsShop();
  shop.addToCart("chat-bubble-neon");

  shop.updateCartQuantity("chat-bubble-neon", 0);

  assert.equal(shop.viewCart().items.length, 0);
  assert.equal(shop.viewCart().subtotalCents, 0);
});

test("cart rejects invalid quantities", () => {
  const cart = new ShoppingCart();
  const product = {
    id: "test-product",
    name: "Test product",
    priceCents: 100,
    currency: "CNY"
  };

  assert.throws(() => cart.addProduct(product, 0), /positive integer/);
  assert.throws(() => cart.addProduct(product, 1.5), /positive integer/);
  assert.throws(
    () => cart.updateQuantity("missing", 2),
    /is not in the cart/
  );
});

test("checkout creates an immutable order snapshot with a pending payment status", () => {
  const orderService = new OrderService({
    idFactory: () => "order-test-001",
    clock: () => new Date("2026-09-22T12:00:00.000Z")
  });
  const shop = new VirtualGoodsShop({ orderService });

  shop.addToCart("chat-bubble-neon", 2);
  const order = shop.checkout("buyer@example.com");
  shop.updateCartQuantity("chat-bubble-neon", 1);

  assert.deepEqual(order, {
    id: "order-test-001",
    status: "PENDING_PAYMENT",
    customerEmail: "buyer@example.com",
    createdAt: "2026-09-22T12:00:00.000Z",
    currency: "CNY",
    items: [
      {
        productId: "chat-bubble-neon",
        name: "Neon Chat Bubble",
        unitPriceCents: 1290,
        currency: "CNY",
        quantity: 2
      }
    ],
    totalQuantity: 2,
    subtotalCents: 2580,
    totalCents: 2580
  });
});

test("checkout rejects invalid email addresses and empty carts", () => {
  const shop = new VirtualGoodsShop();

  assert.throws(() => shop.checkout("invalid-email"), /valid customerEmail/);
  assert.throws(() => shop.checkout("buyer@example.com"), /empty cart/);
});
