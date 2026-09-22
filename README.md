# Virtual Goods Shopping System

这是一个不连接数据库、不调用真实支付接口的本地模拟版本，用来先固定虚拟商品购物流程和数据结构。

## 当前范围

- 商品目录：列出有效商品，并按商品 ID 查询。
- 购物车：添加商品、合并相同商品数量、修改数量、删除商品、计算总价。
- 模拟结算：从购物车生成 `PENDING_PAYMENT` 订单。
- 价格单位：统一使用整数分，例如 `990` 表示 `9.90 CNY`，避免浮点数误差。
- 数据存储：全部为当前进程内存，进程结束后数据消失。

## 运行

如果本机安装了 Node.js 18 或更高版本：

```text
npm test
npm run demo
```

也可以不使用 npm：

```text
node --test
node scripts/demo.js
```

## 主要调用方式

```js
const { VirtualGoodsShop } = require("./src/shop");

const shop = new VirtualGoodsShop();
const products = shop.listProducts();

shop.addToCart(products[0].id, 1);
shop.updateCartQuantity(products[0].id, 2);

const cart = shop.viewCart();
const order = shop.checkout("buyer@example.com");
```

## 后续正式开发时的对接边界

- `ProductCatalog` 后续可以替换为数据库查询，但 `listActive()` 和 `getById()` 的返回字段应保持兼容。
- `ShoppingCart` 当前是单用户、单进程对象；正式版需要绑定用户 ID，并处理并发和持久化。
- `OrderService` 当前只生成订单快照；正式版还需要库存校验、支付单、支付回调、订单状态流转和幂等控制。
- 当前结算不会清空购物车，也不会真正扣款，这是刻意保留的模拟行为。
- 商品价格已经写入订单明细快照，后续商品调价不应修改已创建订单的金额。
