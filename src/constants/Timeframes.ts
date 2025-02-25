export enum Timeframes {
  NOW = "Current",
  ONE_DAY = "1D",
  ONE_WEEK = "1W",
  ONE_MONTH = "1M",
  ONE_YEAR = "1Y",
}

export const TimeframeValues: Record<Timeframes, () => number> = {
  [Timeframes.NOW]: () => Date.now() - 60 * 1000,
  [Timeframes.ONE_DAY]: () => Date.now() - 24 * 60 * 60 * 1000,
  [Timeframes.ONE_WEEK]: () => Date.now() - 7 * 24 * 60 * 60 * 1000,
  [Timeframes.ONE_MONTH]: () => Date.now() - 30 * 24 * 60 * 60 * 1000,
  [Timeframes.ONE_YEAR]: () => Date.now() - 365 * 24 * 60 * 60 * 1000,
};
