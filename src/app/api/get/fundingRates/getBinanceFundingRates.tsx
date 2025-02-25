import { get } from "@/common/api";

const getBinanceFundingRates = async ({
  symbol,
  endTime,
  limit,
}: {
  symbol: string;
  endTime?: number;
  limit?: number;
}) => {
  const response = await get({
    apiEndpoint: `https://fapi.binance.com/fapi/v1/fundingRate`,
    params: {
      symbol: symbol,
      limit: limit,
      endTime: endTime,
    },
  });
  return response;
};

export default getBinanceFundingRates;
