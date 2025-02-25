"use client";

import { FC, useState, useMemo } from "react";
import { useFundingRates } from "@/app/hooks/useFundingRates";
import { format } from "date-fns";
import DataTables from "@/components/dataTables";
import {
  BinaceData,
  BybitData,
  OkxData,
  FundingRateData,
} from "@/interfaces/funding-rates/funding-rates-interface";
import { CoinSymbols } from "@/constants/CoinSymbols";
import { Timeframes, TimeframeValues } from "@/constants/Timeframes";

const Dashboard: FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    CoinSymbols.BTCUSDT
  );
  const [timeframe, setTimeframe] = useState<string>(Timeframes.ONE_DAY);
  const endTime = useMemo(
    () => TimeframeValues[timeframe as keyof typeof TimeframeValues],
    [timeframe]
  );

  const { data, isLoading } = useFundingRates({
    symbol: selectedSymbol,
    endTime,
    limit: 1,
  });

  console.log(endTime);

  const symbols = [CoinSymbols.BTCUSDT, CoinSymbols.ETHUSDT];
  const timeframes = [
    Timeframes.ONE_DAY,
    Timeframes.ONE_WEEK,
    Timeframes.ONE_MONTH,
    Timeframes.ONE_YEAR,
  ];

  // Normalize rates to 24-hour equivalent
  const normalizeRate = (rate: string, exchange: string): number => {
    const baseRate = Number(rate);
    // Different exchanges have different funding intervals
    const intervalsPerDay = {
      Binance: 3, // 8-hour intervals
      Bybit: 3, // 8-hour intervals
      OKX: 3, // 8-hour intervals
      // HyperLiquid: 24, // 1-hour intervals
    };
    return baseRate * intervalsPerDay[exchange as keyof typeof intervalsPerDay];
  };

  console.log(data);

  const transformedBinanceData: FundingRateData[] =
    data?.binanceData?.map((item: BinaceData) => ({
      id: `binance-${item.symbol}-${item.fundingTime}`,
      exchange: "Binance",
      symbol: item.symbol,
      fundingRate: item.fundingRate,
      timestamp: Number(item.fundingTime),
      markPrice: item.markPrice,
      annualizedRate: (
        normalizeRate(item.fundingRate, "Binance") * 365
      ).toString(),
    })) || [];

  const transformedBybitData: FundingRateData[] =
    data?.bybitData?.map((item: BybitData) => ({
      id: `bybit-${item.symbol}-${item.fundingRateTimestamp}`,
      exchange: "Bybit",
      symbol: item.symbol,
      fundingRate: item.fundingRate,
      timestamp: Number(item.fundingRateTimestamp),
      annualizedRate: (
        normalizeRate(item.fundingRate, "Bybit") * 365
      ).toString(),
    })) || [];

  const transformedOkxData: FundingRateData[] =
    data?.okxData?.map((item: OkxData) => ({
      id: `okx-${item.instId}-${item.fundingTime}`,
      exchange: "OKX",
      symbol: item.instId.includes("-SWAP")
        ? item.instId.split("-SWAP")[0].split("-").join("")
        : item.instId,
      fundingRate: item.fundingRate,
      timestamp: Number(item.fundingTime),
      realizedRate: item.realizedRate,
      annualizedRate: (normalizeRate(item.fundingRate, "OKX") * 365).toString(),
    })) || [];

  const transformedData: FundingRateData[] = [
    ...transformedBinanceData,
    ...transformedBybitData,
    ...transformedOkxData,
  ];

  const columns = [
    {
      key: "exchange",
      header: "Exchange",
    },
    {
      key: "symbol",
      header: "Symbol",
    },
    {
      key: "fundingRate",
      header: "Current Rate",
      render: (value: string) => `${(Number(value) * 100).toFixed(4)}%`,
    },
    {
      key: "annualizedRate",
      header: "24h Equivalent",
      render: (value: string) => `${(Number(value) * 100).toFixed(2)}%`,
    },
    {
      key: "timestamp",
      header: "Time",
      render: (value: number) => format(value, "MM/dd/yyyy, HH:mm:ss"),
    },
    {
      key: "markPrice",
      header: "Mark Price",
      render: (value: string | undefined) => value || "-",
    },
  ];

  return (
    <div className="my-10">
      <div className="flex gap-4 mb-4">
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>
      <div className="flex rounded-md shadow-sm">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 text-sm font-medium ${
              timeframe === tf
                ? "bg-indigo-600 text-white"
                : " text-gray-700 hover:bg-gray-50"
            } border border-gray-300 first:rounded-l-md last:rounded-r-md -ml-px first:ml-0`}
          >
            {tf}
          </button>
        ))}
      </div>

      <DataTables
        title="Funding Rates"
        description={`Current funding rates across exchanges (${timeframe} view)`}
        columns={columns}
        data={transformedData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Dashboard;
