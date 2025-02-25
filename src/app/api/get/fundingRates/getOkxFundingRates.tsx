import { get } from "@/common/api";

const getOkxFundingRates = async ({
  symbol,
  endTime,
  limit,
}: {
  symbol: string;
  endTime?: number;
  limit?: number;
}) => {
  let symbolString = "";

  switch (symbol) {
    case "BTCUSDT":
      symbolString = "BTC-USDT-SWAP";
      break;
    case "ETHUSDT":
      symbolString = "ETH-USDT-SWAP";
      break;
    default:
      symbolString = symbol;
  }

  const response = await get({
    apiEndpoint: `https://www.okx.com/api/v5/public/funding-rate-history`,
    params: {
      instId: symbolString,
      limit: limit,
      after: endTime,
    },
  });
  return response;
};

export default getOkxFundingRates;
