export interface BinaceData {
  symbol: string;
  fundingRate: string;
  fundingTime: number;
  markPrice: string;
}

export interface BybitData {
  symbol: string;
  fundingRate: string;
  fundingRateTimestamp: string;
}

export interface OkxData {
  fundingRate: string;
  fundingTime: string;
  instId: string;
  method: string;
  realizedRate: string;
}

export interface FundingRateData {
  id: string;
  exchange: string;
  symbol: string;
  fundingRate: string;
  timestamp: number;
  markPrice?: string;
  annualizedRate?: string;
}
