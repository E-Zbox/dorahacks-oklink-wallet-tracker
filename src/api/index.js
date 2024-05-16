// env
const { OKLINK_API_KEY } = process.env;

const baseURL = "https://www.oklink.com/api/v5";

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

const PEPE = "0x6982508145454Ce325dDbE47a25d4ec3d2311933";

const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

exports.tokenToEthereumAddress = {
  DAI,
  PEPE,
  USDT,
};

const tokenToEthereumAddress = {
  DAI,
  PEPE,
  USDT,
};

if (!OKLINK_API_KEY) {
  throw new Error("Configure env variables");
}

const headers = {
  "Content-Type": "application/json",
  "Ok-Access-Key": OKLINK_API_KEY,
};

exports.getActiveEVMChains = async () => {
  let response = {
    data: {},
    error: "",
    success: false,
  };
  try {
    const watchlist = Object.getOwnPropertyNames(tokenToEthereumAddress);

    await Promise.all(
      watchlist.map(async (key) => {
        const result = await fetch(
          `${baseURL}/explorer/address/address-active-chain?address=${tokenToEthereumAddress[key]}`,
          {
            headers,
          }
        );

        const { data } = await result.json();

        response.data[key] = data;
      })
    );

    response = {
      ...response,
      success: true,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

exports.getAddressTransactionList = async (address, page) => {
  let response = {
    data: {},
    error: "",
    success: false,
  };

  try {
    const result = await fetch(
      `${baseURL}/explorer/address/transaction-list?chainShortName=ETH&address=${address}&page=${page}`,
      {
        headers,
      }
    );

    const { code, msg, data } = await result.json();

    if (code !== "0") throw msg;

    const [{ totalPage, transactionLists }] = data;

    response = {
      data: { totalPage, transactionLists },
      error: "",
      success: true,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

exports.getBatchAddressesERCxBalance = async (addressArray, page) => {
  let response = {
    data: {},
    error: "",
    success: false,
  };

  try {
    const result = await fetch(
      `${baseURL}/explorer/address/token-balance-multi?chainShortName=ETH&address=${addressArray.join()}&page=${page}`,
      {
        headers,
      }
    );

    const { code, msg, data } = await result.json();

    if (code !== "0") throw msg;

    const [{ totalPage, balanceList }] = data;

    response = {
      data: { totalPage, balanceList },
      error: "",
      success: true,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

exports.getEthereumWhales = async () => {
  let response = {
    data: {},
    error: "",
    success: false,
  };
  try {
    const result = await fetch(
      `${baseURL}/explorer/address/rich-list?chainShortName=ETH`,
      {
        headers,
      }
    );

    const { code, msg, data } = await result.json();

    if (code !== "0") throw msg;

    response = {
      data: data.slice(0, 2),
      error: "",
      success: true,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

exports.getTokenAddressInformation = async (tokenContractAddress) => {
  let response = {
    data: {},
    error: "",
    success: false,
  };

  try {
    const result = await fetch(
      `${baseURL}/explorer/token/token-list?chainShortName=ETH&tokenContractAddress=${tokenContractAddress}`,
      {
        headers,
      }
    );

    const { code, msg, data } = await result.json();

    if (code !== "0") throw msg;

    console.log({ tokenContractAddress, data: JSON.stringify(data) });

    const [
      {
        tokenList: [{ token: tokenName, protocolType, totalSupply, price }],
      },
    ] = data;

    response = {
      data: {
        tokenName,
        tokenContractAddress,
        protocolType,
        totalSupply,
        price,
      },
      error: "",
      success: true,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

exports.getTokenMarketData = async () => {
  let response = {
    data: {},
    error: "",
    success: false,
  };

  try {
    const watchlist = Object.getOwnPropertyNames(tokenToEthereumAddress);

    await Promise.all(
      watchlist.map(async (key) => {
        const result = await fetch(
          `${baseURL}/explorer/tokenprice/market-data?chainId=1&tokenContractAddress=${tokenToEthereumAddress[key]}`,
          {
            headers,
          }
        );

        const { code, msg, data: _data } = await result.json();

        if (code !== "0") throw msg;

        const [{ lastPrice, circulatingSupply }] = _data;

        const data = [
          { ..._data[0], totalTokenValueInUSDT: lastPrice * circulatingSupply },
        ];

        response.data[key] = data;
      })
    );

    response = {
      ...response,
      success: true,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};

exports.postAddressActivityWebhookTracker = async () => {
  let response = {
    data: {},
    error: "",
    success: false,
  };

  try {
    const result = await fetch(
      `${baseURL}/explorer/webhook/create-address-activity-tracker`,
      {
        headers,
        method: "POST",
        body: {
          event: "tokenTransfer",
          chainShortName: "eth",
          webhookUrl: "your-own-webhook",
          trackerName: "address-activity-tracker",
          addresses: [
            "0xceb69f6342ece283b2f5c9088ff249b5d0ae66ea",
            "0x21a31ee1afc51d94c2efccaa2092ad1028285549",
          ],
          tokenContractAddress: [
            "0xdac17f958d2ee523a2206206994597c13d831ec7",
            "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
          ],
          valueUsdFilter: {
            minValueUsd: "10000",
            maxValueUsd: "100000",
          },
          amountFilter: {
            minAmount: "23",
            maxAmount: "40",
          },
        },
      }
    );

    const { msg, code, data } = await result.json();

    if (code !== "0") throw msg;

    response = {
      data,
      error: "",
      success: true,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};
