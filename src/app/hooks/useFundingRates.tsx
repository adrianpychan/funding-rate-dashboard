/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import getBinanceFundingRates from "../api/get/fundingRates/getBinanceFundingRates";
import getBybitFundingRates from "../api/get/fundingRates/getByBitFundingRates";
import getOkxFundingRates from "../api/get/fundingRates/getOkxFundingRates";
// import getHyperliquidFundingRates from "../api/get/fundingRates/getHyperliquidFundingRates";

export const useFundingRates = ({
  symbol,
  endTime,
  limit,
}: {
  symbol: string;
  endTime?: number;
  limit?: number;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["funding-rates", symbol, endTime?.toString()],
    queryFn: async () => {
      const results = {
        binanceData: [],
        bybitData: [],
        okxData: [],
        hyperLiquidData: [],
      };

      try {
        results.binanceData = await getBinanceFundingRates({
          symbol,
          endTime,
          limit,
        });
      } catch (error) {
        console.error("Binance API error:", error);
      }

      try {
        const bybitResponse = await getBybitFundingRates({
          symbol,
          endTime,
          limit,
        });
        results.bybitData = bybitResponse?.result?.list;
      } catch (error) {
        console.error("Bybit API error:", error);
      }

      try {
        const okxResponse = await getOkxFundingRates({
          symbol,
          endTime,
          limit,
        });
        results.okxData = okxResponse?.data;
      } catch (error) {
        console.error("OKX API error:", error);
      }

      // try {
      //   results.hyperLiquidData = await getHyperliquidFundingRates({
      //     symbol,
      //   });
      // } catch (error) {
      //   console.error("HyperLiquid API error:", error);
      // }

      return results;
    },
  });

  return { data, isLoading, error };
};
