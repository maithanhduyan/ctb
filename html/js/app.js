"use strict";
document.addEventListener("DOMContentLoaded", async function () {
  // Exchanges
  const exchanges = ccxt.exchanges;

  const exchange = new ccxt.binance({
    // enableRateLimit: true,
  });
  // exchange.setSandboxMode(false);

  // Socket Url
  const url = "wss://testnet.binance.vision/ws";
  // WebSocket
  const socket = new WebSocket(url);

  // Connection opened
  // 'btcusdt@depth',
  // 'bchusdt@depth',
  // 'btcusdt@aggTrade',
  // 'btcusdt@trade',
  // 'btcusdt@kline_1d',
  // 'btcusdt@miniTicker',
  // 'btcusdt@depth20'
  socket.addEventListener("open", function (event) {
    //   console.log("Open");
    var data = {
      method: "SUBSCRIBE",
      params: ["btcusdt@aggTrade"],
      id: 1,
    };

    // Send SUBSCRIBE data to server
    socket.send(JSON.stringify(data));
  });

  // Socket Error
  socket.onerror = function (error) {
    console.error(error);
  };

  // Listen Message from server
  socket.addEventListener("message", function (event) {
    //console.log("Message from server ", event.data);
    const data = JSON.parse(event.data);
    //   console.log(data.p);
    document.title = data.p; // Price
  });

  let currentBar = {};
  // onmessage

  // {
  //     "e": "aggTrade",  // Event type
  //     "E": 123456789,   // Event time
  //     "s": "BTCUSDT",    // Symbol
  //     "a": 12345,       // Aggregate trade ID
  //     "p": "0.001",     // Price
  //     "q": "100",       // Quantity
  //     "f": 100,         // First trade ID
  //     "l": 105,         // Last trade ID
  //     "T": 123456785,   // Trade time
  //     "m": true,        // Is the buyer the market maker?
  //     "M": true         // Ignore
  //   }
  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    const quotesElement = document.getElementById("quotes");
    // Add quote
    const quoteElement = document.createElement("div");
    quoteElement.className = "quote";
    quoteElement.innerHTML = `<b>${data.s}</b> ${data.p} ${data.q}`;
    quotesElement.appendChild(quoteElement);
    var elements = document.getElementsByClassName("quote");
    if (elements.length > 10) {
      quotesElement.removeChild(elements[0]);
    }

    // Update price on chart
    if (currentBar.time != null) {
      currentBar.close = data.p;
      candleSeries.update(currentBar);
    }
  };

  // Chart
  const symbol = "BTC/USDT";
  const timeframe = "1d"; // timeframe: 1m , 15m , 1h, 4h , 1d, 1w
  const since = undefined;
  const limit = 600; // number of candles
  const config = {
    width: 1200,
    height: 400,
    layout: {
      backgroundColor: "#000000",
      textColor: "#ffffff",
    },
    grid: {
      vertLines: {
        color: "#404040",
      },
      horzLines: {
        color: "#404040",
      },
    },
    priceScale: {
      position: "right",
      mode: 1,
      autoScale: true,
      invertScale: false,
      borderColor: "#cccccc",
    },
    timeScale: {
      fixLeftEdge: true,
      lockVisibleTimeRangeOnResize: true,
      rightBarStaysOnScroll: true,
      visible: true,
      timeVisible: true,
      secondsVisible: true,
      borderColor: "#cccccc",
    },
    crosshair: {
      mode: window.LightweightCharts.CrosshairMode.Normal,
    },
  };
  const chart = window.LightweightCharts.createChart(
    document.getElementById("chart"),
    config
  );
  const candleSeries = chart.addCandlestickSeries();
  //   console.log(ccxt.exchanges); // print all available exchanges
  try {
    // Load Market Data
    const response = await exchange.fetchOHLCV(symbol, timeframe, since, limit);
    const last = response[response.length - 1];
    const [timestamp, open, high, low, close] = last;
    const data = response.map(([timestamp, open, high, low, close]) => ({
      time: exchange.iso8601(timestamp),
      open,
      high,
      low,
      close,
    }));
    currentBar = data[data.length - 1];
    console.log(data.length);
    candleSeries.setData(data);
    const price = data[data.length - 1].close;
    document.title = "" + price;

    // Draw MA High Line
    const smaHighLine = chart.addLineSeries({
      color: "green",
      lineWidth: 1,
    });
    // Draw MA Low Line
    const smaLowLine = chart.addLineSeries({
      color: "red",
      lineWidth: 1,
    });
    // MA Length
    const ma_length = 30;

    // Add SMA
    var smaHighData = calculateSMA(data, ma_length, "high");
    var smaLowData = calculateSMA(data, ma_length, "low");
    smaHighLine.setData(smaHighData);
    smaLowLine.setData(smaLowData);

    // Loop
    while (true) {
      try {
      } catch (e) {
        console.log(e.constructor.name, e.message);
      }
      await exchange.sleep(1000); // 1000  = 1 second
    }
  } catch (e) {
    alert(e.constructor.name + " " + e.message);
  }

  //   Indicator
  // SMA Calculate
  function calculateSMA(data, count, type) {
    var avg = function (data) {
      var sum = 0;
      switch (type) {
        case "open":
          for (var i = 0; i < data.length; i++) {
            sum += data[i].open;
          }
          break;
        case "high":
          for (var i = 0; i < data.length; i++) {
            sum += data[i].high;
          }
          break;
        case "low":
          for (var i = 0; i < data.length; i++) {
            sum += data[i].low;
          }
          break;
        case "close":
          for (var i = 0; i < data.length; i++) {
            sum += data[i].close;
          }
          break;
      }

      return sum / data.length;
    };
    var result = [];
    for (var i = count - 1, len = data.length; i < len; i++) {
      var val = avg(data.slice(i - count + 1, i));
      result.push({ time: data[i].time, value: val });
    }
    return result;
  }
});
