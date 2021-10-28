Session 1: Setting-up the Project

Looking at the starter point for our node project, obtaining a Coinbase API key and making our first request to the API.

Getting a GDAX API key
Using the GDAX API key with the gdax package
Obtaining Bitcoin and Ethereum historical Prices
Session 2: Historical Prices

We want to obtain historical pricing data so that we can see which strategy will work best when running our algorithms. We also want to make sure that any strategy we use will work correctly.

Obtain historical data with command line parameters
Getting a specified date range with historical data
Creating candlesticks with our data.
Session 3: Backtesting

In this session, we'll implement our backtesting. This will allow us to run the bot using historical data to see how well our strategy works. We'll also create some pretend signals to see this in action.

Retrieving data from GDAX
Writing our backtester and putting a strategy framework in place.
Session 4: Technical Indicators & Strategies

In this session we'll discuss technical indicators and their uses in trading algorithms. We'll then start to look at creating a basic strategy using one indicator.

Looking at various technical indicators
Implementing one to create a simple trading strategy.
Adding a stop loss to our strategy.
Session 5: Running Live

In this session we'll modify our code so that we can run live. In order to do this we'll need to change our algorithm so that it can run with developing candlesticks as well as historical fixed candlesticks and that our buy and sell signals will call the GDAX api. We also want to create a socket feed with GDAX so that we can get the most up to date data in real time, giving us a competitive edge.

Implementing the developing Candlestick
Adding in the socket feed for prices.
Session 6: Orders

In this session we'll look at implementing our strategy to our live data feed and then posting orders on our buy and sell signals.

Using a serial queue.
Learn about Market & Limit Orders
Adding calls to gdax to create market and limit orders
Tying our strategy signals to our trader for orders.
Session 7: Deployment

It's time to deploy! In this session we'll load our trading bot into Docker and then begin to run it in the cloud via Digital Ocean using a virtual wallet.

Creating a Docker image
Uploading onto Digital Ocean
Running our app with a virtual wallet & currency
Session 8: Results & Overview

We'll review the results of our virtual wallet and see if we made a profit or loss, if we made a profit, we'll start up with some real money and see how it does.

Look at the results of our test data app and see how well we did
Run with a live wallet if all went well.
