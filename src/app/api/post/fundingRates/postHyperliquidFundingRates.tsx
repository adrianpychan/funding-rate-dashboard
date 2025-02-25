import { post } from "@/common/api";

const postHyperliquidFundingRates = async ({
  symbol,
  startTime,
  endTime,
}: {
  symbol: string;
  startTime: number;
  endTime?: number;
}) => {
  const convertSymbol = (symbol: string) => {
    switch (symbol) {
      case "BTCUSDT":
        return "BTC";
      case "ETHUSDT":
        return "ETH";
      default:
        return symbol;
    }
  };

  const response = await post({
    apiEndpoint: "https://api.hyperliquid.xyz/info",
    body: {
      type: "fundingHistory",
      coin: convertSymbol(symbol),
      startTime: startTime,
      endTime: endTime,
    },
  });
  return response;
};

export default postHyperliquidFundingRates;
