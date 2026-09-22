const { VirtualGoodsShop } = require("../src/shop");

const shop = new VirtualGoodsShop();

console.log("Active products:");
console.table(
  shop.listProducts().map(({ id, name, priceCents, currency }) => ({
    id,
    name,
    price: `${(priceCents / 100).toFixed(2)} ${currency}`
  }))
);

shop.addToCart("avatar-frame-sunset", 1);
shop.addToCart("starter-coins-100", 2);

console.log("\nCart:");
console.log(JSON.stringify(shop.viewCart(), null, 2));

const order = shop.checkout("demo@example.com");
console.log("\nPending order:");
console.log(JSON.stringify(order, null, 2));
