/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from "@tanstack/react-query";
import getBinanceFundingRates from "../api/get/fundingRates/getBinanceFundingRates";
import getBybitFundingRates from "../api/get/fundingRates/getByBitFundingRates";
import getOkxFundingRates from "../api/get/fundingRates/getOkxFundingRates";
import postHyperliquidFundingRates from "../api/post/fundingRates/postHyperliquidFundingRates";

export const useFundingRates = ({
  symbol,
  startTime,
  endTime,
  limit,
}: {
  symbol: string;
  startTime: number;
  endTime?: number;
  limit?: number;
}) => {
  const { mutateAsync: fetchHyperliquidFundingRates } = useMutation({
    mutationFn: () =>
      postHyperliquidFundingRates({
        symbol,
        startTime: startTime,
        endTime: endTime || undefined,
      }),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "funding-rates",
      symbol,
      startTime?.toString(),
      endTime?.toString(),
      limit?.toString(),
    ],
    queryFn: async () => {
      const fetchWithFallback = async (
        fetcher: () => Promise<any>,
        exchange: string
      ) => {
        try {
          return await fetcher();
        } catch (error) {
          console.error(`${exchange} API error:`, error);
          return null;
        }
      };

      const [binanceData, bybitResponse, okxResponse, hyperLiquidResponse] =
        await Promise.all([
          fetchWithFallback(
            () => getBinanceFundingRates({ symbol, startTime, endTime, limit }),
            "Binance"
          ),
          fetchWithFallback(
            () => getBybitFundingRates({ symbol, startTime, endTime, limit }),
            "Bybit"
          ),
          fetchWithFallback(
            () => getOkxFundingRates({ symbol, startTime, endTime, limit }),
            "OKX"
          ),
          fetchWithFallback(
            () => fetchHyperliquidFundingRates(),
            "Hyperliquid"
          ),
        ]);

      return {
        binanceData: binanceData || [],
        bybitData: bybitResponse?.result?.list || [],
        okxData: okxResponse?.data || [],
        hyperLiquidData: hyperLiquidResponse || [],
      };
    },
  });

  return { data, isLoading, error };
};
