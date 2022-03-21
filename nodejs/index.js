const ccxt = require("ccxt");
const moment = require("moment");
const delay = require("delay");
require("dotenv").config();

const binance = new ccxt.binance({
  apiKey: process.env.API_KEY,
  secret: process.env.SECRET,
});

// For demo account
binance.setSandboxMode(true);

async function printBalance(btcPrice) {
  const balance = await binance.fetchBalance();
  const total = balance.total;
  console.log(`Balance : BTC ${total.BTC}, USDT: ${total.USDT}`);
  console.log(`Total USD: ${(total.BTC - 1) * btcPrice + total.USDT}. \n`);
}

// Tick
async function tick() {
  const prices = await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 5);
  const bPrice = prices.map((price) => {
    return {
      timestamp: moment(price[0]).format(),
      open: price[1],
      high: price[2],
      low: price[3],
      close: price[4],
      volume: price[5],
    };
  });
  const averagePrice = bPrice.reduce((acc, price) => acc + price.close, 0) / 5;
  const lastPrice = bPrice[bPrice.length - 1].close;
  //   console.log(bPrice);
  console.log(
    bPrice.map((p) => p.close),
    averagePrice,
    lastPrice
  );

  //   Algo Trading
  const direction = lastPrice > averagePrice ? "sell" : "buy";
  const TRADE_SIZE = 100;
  const quantity = TRADE_SIZE / lastPrice;

  console.log(`Average Price: ${averagePrice}. LastPrice: ${lastPrice}`);
  const order = await binance.createMarketOrder(
    "BTC/USDT",
    direction,
    quantity
  );

  console.log(
    `${moment().format()}: ${direction} ${quantity} BTC at ${lastPrice}`
  );
  console.log(order);
  printBalance(lastPrice);
}

async function main() {
  while (true) {
    await tick();
    await delay(3 * 1000);
  }
}

// printBalance();
main();
