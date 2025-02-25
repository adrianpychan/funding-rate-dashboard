import { get } from "@/common/api";

const getBybitFundingRates = async ({
  symbol,
  startTime,
  endTime,
  limit,
}: {
  symbol: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}) => {
  const response = await get({
    apiEndpoint: `https://api-testnet.bybit.com/v5/market/funding/history`,
    params: {
      category: "linear",
      symbol: symbol,
      limit: limit,
      startTime: startTime,
      endTime: endTime,
    },
  });

  return response;
};

export default getBybitFundingRates;
