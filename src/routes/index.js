const express = require("express");
// controllers
const {
  getActiveEVMChainsController,
  getTokenMarketDataController,
  getNativeTokenBalanceInActiveChainsController,
  getAddTransactionListController,
  postAddressActivityWebhookTrackerController,
} = require("../controllers");

const Router = express.Router();

// Task 1: #1
Router.get("/active/chains", getActiveEVMChainsController);

// Task 1: #2
Router.get(
  "/active/chains/whales/token/balance",
  getNativeTokenBalanceInActiveChainsController
);

// Task 1: #3
Router.get("/tokens/marketdata", getTokenMarketDataController);

// Task 1: #4
Router.get("/address/latest/transaction", getAddTransactionListController);

// Task 1: #5
Router.get("/webhook/tracker", postAddressActivityWebhookTrackerController);

module.exports = Router;
