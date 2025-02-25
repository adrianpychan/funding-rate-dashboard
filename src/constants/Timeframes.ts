export enum Timeframes {
  NOW = "Current",
  ONE_DAY = "1 Day",
  ONE_WEEK = "7 Day",
  ONE_MONTH = "30 Day",
  ONE_YEAR = "1 Year",
}

export const TimeframeValues: Record<Timeframes, () => number> = {
  [Timeframes.NOW]: () => Date.now() - 60 * 1000,
  [Timeframes.ONE_DAY]: () => Date.now() - 24 * 60 * 60 * 1000,
  [Timeframes.ONE_WEEK]: () => Date.now() - 7 * 24 * 60 * 60 * 1000,
  [Timeframes.ONE_MONTH]: () => Date.now() - 30 * 24 * 60 * 60 * 1000,
  [Timeframes.ONE_YEAR]: () => Date.now() - 365 * 24 * 60 * 60 * 1000,
};
