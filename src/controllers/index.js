// api
const {
  getActiveEVMChains,
  getTokenMarketData,
  getEthereumWhales,
  getBatchAddressesERCxBalance,
  getTokenAddressInformation,
  getAddressTransactionList,
  tokenToEthereumAddress,
} = require("../api");

// Task 1: #1 Identify the EVM active chains where the address has transactions.
exports.getActiveEVMChainsController = async (req, res, next) => {
  try {
    const { data, error, success } = await getActiveEVMChains();

    if (!success) {
      throw error;
    }

    return res.status(200).json({ data, error, success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Task 1: #2
 * Retrieve the native token balance, ERC-20 tokens holding,
 * and NFT holdings on the identified chains.
 */
exports.getNativeTokenBalanceInActiveChainsController = async (
  req,
  res,
  next
) => {
  try {
    const whalesResponse = await getEthereumWhales();

    if (!whalesResponse.success) throw whalesResponse.error;

    const [ethWhaleRank1, ethWhaleRank2] = whalesResponse.data;

    let totalPage = 1;
    let balanceList = [];

    for (let page = 1; page <= totalPage; page++) {
      let { data, error, success } = await getBatchAddressesERCxBalance(
        [ethWhaleRank1.address, ethWhaleRank2.address],
        page
      );

      if (!success) throw error;

      balanceList = [...balanceList, ...data.balanceList];

      if (totalPage < data.totalPage) {
        totalPage = data.totalPage;

        // remove this condition to get all available balance for tokens
        if (totalPage > 2) {
          totalPage = 2;
        }
      }
    }

    // remove slice() to get full data
    // let's get Token by address information
    const data = await Promise.all(
      balanceList
        .slice(0, 5)
        .map(async ({ address, holdingAmount, tokenContractAddress }) => {
          // check if tokenContractAddress information is saved in session to not repeat queries
          if (req.session[tokenContractAddress]) {
            return {
              address,
              holdingAmount,
              token: req.session[tokenContractAddress],
            };
          }

          let {
            data: token,
            error,
            success,
          } = await getTokenAddressInformation(tokenContractAddress);

          if (!success) throw error;

          // let's set tokenContractAddress object in req.session
          req.session[tokenContractAddress] = token;

          return {
            address,
            holdingAmount,
            token,
          };
        })
    );

    return res.status(200).json({ data, error: "", success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Task 1: #3
 * For ERC-20 tokens, calculate the total token value in USDT and assess the token basic data performance
 * (e.g. market cap, 24-hour trading volume).
 */
exports.getTokenMarketDataController = async (req, res, next) => {
  try {
    const { data, error, success } = await getTokenMarketData();

    if (!success) {
      throw error;
    }

    return res.status(200).json({ data, error, success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Task 1: #4
 * Analyze the most recent 10,000 transactions of the address,
 * determine the address with the most interactions,and ascertain if it belongs to a large exchange or project.
 */
exports.getAddTransactionListController = async (req, res, next) => {
  try {
    // NCA = Non Contract Address
    tokenToEthereumAddress["NCA"] =
      "0x1E7f38435d6ca3646e76F24919a0dfc26c0333B0";

    const watchList = Object.getOwnPropertyNames(tokenToEthereumAddress);

    const data = await Promise.all(
      watchList.map(async (key) => {
        let totalPage = 1;

        let transactionLists = [];
        for (let page = 1; page <= totalPage; page++) {
          let { data, error, success } = await getAddressTransactionList(
            tokenToEthereumAddress[key],
            page
          );

          transactionLists = [...transactionLists, ...data.transactionLists];

          if (!success) throw error;

          if (totalPage < data.totalPage) {
            totalPage = data.totalPage;

            // remove to get full data
            if (totalPage > 2) {
              totalPage = 2;
            }
          }
        }

        return transactionLists;
      })
    );

    return res.status(200).json({ data, error: "", success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Task 1: #5
 * Implement a webhook to monitor token transfer events for the address on the chain.
 */
exports.postAddressActivityWebhookTrackerController = async (
  req,
  res,
  next
) => {
  try {
    const { data, error, success } =
      await this.postAddressActivityWebhookTrackerController();

    if (!success) throw error;

    return res.status(200).json({ data, error, success });
  } catch (error) {
    next(error);
  }
};
