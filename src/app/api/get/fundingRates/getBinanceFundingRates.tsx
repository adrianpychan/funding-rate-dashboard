import { get } from "@/common/api";

const getBinanceFundingRates = async ({
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
    apiEndpoint: `https://fapi.binance.com/fapi/v1/fundingRate`,
    params: {
      symbol: symbol,
      limit: limit,
      startTime: startTime,
      endTime: endTime,
    },
  });
  return response;
};

export default getBinanceFundingRates;
