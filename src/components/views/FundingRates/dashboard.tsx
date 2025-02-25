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
import { getRateComparison } from "@/helpers/get-rate-comparison";
import { normalizeRate } from "@/helpers/normalize-rate";
import btcIcon from "cryptocurrency-icons/svg/color/btc.svg";
import ethIcon from "cryptocurrency-icons/svg/color/eth.svg";
import Image from "next/image";

const Dashboard: FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    CoinSymbols.BTCUSDT
  );
  const [timeframe, setTimeframe] = useState<string>(Timeframes.NOW);
  const startTime = useMemo(
    () => TimeframeValues[timeframe as keyof typeof TimeframeValues](),
    [timeframe]
  );

  const endTime = useMemo(() => Date.now(), []);

  const { data, isLoading } = useFundingRates({
    symbol: selectedSymbol,
    startTime: timeframe !== Timeframes.NOW ? startTime : undefined,
    endTime: timeframe !== Timeframes.NOW ? endTime : undefined,
    limit: 1000,
  });

  const symbols = [CoinSymbols.BTCUSDT, CoinSymbols.ETHUSDT];
  const timeframes = [
    Timeframes.NOW,
    Timeframes.ONE_DAY,
    Timeframes.ONE_WEEK,
    Timeframes.ONE_MONTH,
    Timeframes.ONE_YEAR,
  ];

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

  const coinIcons = {
    [CoinSymbols.BTCUSDT]: btcIcon,
    [CoinSymbols.ETHUSDT]: ethIcon,
  };

  const columns = [
    {
      key: "symbol",
      header: "Symbol",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Image
            alt={value}
            className="w-4 h-4"
            src={coinIcons[value as keyof typeof coinIcons]}
            width={16}
            height={16}
          />
          {value}
        </div>
      ),
    },
    {
      key: "exchange",
      header: "Exchange",
    },
    {
      key: "fundingRate",
      header: "Current Rate",
      render: (value: string) => {
        const { isHighest, isLowest } = getRateComparison(
          value,
          transformedData
        );
        return (
          <span
            className={`${
              isHighest
                ? "text-green-600 font-bold"
                : isLowest
                ? "text-red-600 font-bold"
                : ""
            }`}
          >
            {`${(Number(value) * 100).toFixed(4)}%`}
          </span>
        );
      },
    },
    {
      key: "annualizedRate",
      header: "24h Equivalent",
      render: (value: string, row: FundingRateData) => {
        const { isHighest, isLowest } = getRateComparison(
          row.fundingRate,
          transformedData
        );
        return (
          <span
            className={`${
              isHighest
                ? "text-green-600 font-bold"
                : isLowest
                ? "text-red-600 font-bold"
                : ""
            }`}
          >
            {`${(Number(value) * 100).toFixed(2)}%`}
          </span>
        );
      },
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

  console.log(data);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Funding Rates
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Compare funding rates across major exchanges
          </p>
        </div>

        <div className="mt-4 sm:mt-0 sm:flex sm:items-center space-x-4">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="block w-48 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            {symbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>

          <div className="inline-flex rounded-lg shadow-sm mt-4 sm:mt-0">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`
                  relative inline-flex items-center px-4 py-2 text-sm font-medium
                  ${
                    timeframe === tf
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }
                  border border-gray-300
                  first:rounded-l-lg last:rounded-r-lg
                  -ml-px first:ml-0
                  focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500
                `}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="">
        <DataTables
          title=""
          description=""
          columns={columns}
          data={transformedData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
