export const normalizeRate = (rate: string, exchange: string): number => {
  const baseRate = Number(rate);
  const intervalsPerDay = {
    Binance: 3, // 8-hour intervals
    Bybit: 3, // 8-hour intervals
    OKX: 3, // 8-hour intervals
    // HyperLiquid: 24, // 1-hour intervals
  };
  return baseRate * intervalsPerDay[exchange as keyof typeof intervalsPerDay];
};
