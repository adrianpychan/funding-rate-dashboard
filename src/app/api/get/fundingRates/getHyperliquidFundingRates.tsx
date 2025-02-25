import ccxt from "ccxt";

const getHyperliquidFundingRates = async ({ symbol }: { symbol: string }) => {
  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args);

  const hyperLiquid = new ccxt.hyperliquid();
  hyperLiquid.fetchImplementation = fetcher;

  const response = await hyperLiquid.fetchFundingRates([symbol], {
    limit: 1,
  });
  return response;
};

export default getHyperliquidFundingRates;
