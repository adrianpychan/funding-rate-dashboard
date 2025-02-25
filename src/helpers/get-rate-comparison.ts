import { FundingRateData } from "@/interfaces/funding-rates/funding-rates-interface";

export const getRateComparison = (rate: string, data: FundingRateData[]) => {
  const currentRate = Number(rate);
  const allRates = data.map((item) => Number(item.fundingRate));
  const isHighest = currentRate === Math.max(...allRates);
  const isLowest = currentRate === Math.min(...allRates);
  return { isHighest, isLowest };
};
