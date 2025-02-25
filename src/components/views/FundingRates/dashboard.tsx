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
  HyperliquidData,
} from "@/interfaces/funding-rates/funding-rates-interface";
import { CoinSymbols } from "@/constants/CoinSymbols";
import { Timeframes, TimeframeValues } from "@/constants/Timeframes";
import { getRateComparison } from "@/helpers/get-rate-comparison";
import btcIcon from "cryptocurrency-icons/svg/color/btc.svg";
import ethIcon from "cryptocurrency-icons/svg/color/eth.svg";
import Image from "next/image";

const Dashboard: FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    CoinSymbols.BTCUSDT
  );
  const [timeframe, setTimeframe] = useState<string>(Timeframes.ONE_DAY);
  const startTime = useMemo(
    () => TimeframeValues[timeframe as keyof typeof TimeframeValues](),
    [timeframe]
  );

  const endTime = useMemo(() => Date.now(), []);

  const { data, isLoading } = useFundingRates({
    symbol: selectedSymbol,
    startTime: startTime,
    endTime: timeframe !== Timeframes.NOW ? endTime : undefined,
    limit: 1000,
  });

  const symbols = [CoinSymbols.BTCUSDT, CoinSymbols.ETHUSDT];
  const timeframes = [Timeframes.ONE_DAY];

  const transformedBinanceData: FundingRateData[] =
    data?.binanceData?.map((item: BinaceData) => ({
      id: `binance-${item.symbol}-${item.fundingTime}`,
      exchange: "Binance",
      symbol: item.symbol,
      fundingRate: item.fundingRate,
      timestamp: Number(item.fundingTime),
      markPrice: item.markPrice,
    })) || [];

  const transformedBybitData: FundingRateData[] =
    data?.bybitData?.map((item: BybitData) => ({
      id: `bybit-${item.symbol}-${item.fundingRateTimestamp}`,
      exchange: "Bybit",
      symbol: item.symbol,
      fundingRate: item.fundingRate,
      timestamp: Number(item.fundingRateTimestamp),
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
    })) || [];

  const transformedHyperliquidData: FundingRateData[] =
    data?.hyperLiquidData
      ?.map((item: HyperliquidData) => ({
        id: `hyperliquid-${item.coin}-${item.time}`,
        exchange: "Hyperliquid",
        symbol: item.coin + "USDT",
        fundingRate: item.fundingRate,
        timestamp: Number(item.time),
        premium: item.premium,
      }))
      .filter((data: FundingRateData, index: number) => index % 8 === 0) || [];

  const transformedData: FundingRateData[] = [
    ...transformedBinanceData,
    ...transformedBybitData,
    ...transformedOkxData,
    ...transformedHyperliquidData,
  ].sort((a: FundingRateData, b: FundingRateData) => {
    // First sort by exchange
    if (a.exchange !== b.exchange) {
      return a.exchange.localeCompare(b.exchange);
    }

    // Then sort by timestamp
    return a.timestamp - b.timestamp;
  });

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
      key: "timestamp",
      header: "Time",
      render: (value: number) => {
        if (typeof value === "number") {
          return format(value, "MM/dd/yyyy, HH:mm:ss");
        }
        return "-";
      },
    },
  ];

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
            className="border border-solid border-black p-2 block w-48 rounded-lg shadow-sm text-sm outline-none focus:ring-0 focus:ring-offset-0"
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
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }
                  border border-gray-300
                  first:rounded-l-lg last:rounded-r-lg
                  -ml-px first:ml-0
                  focus:z-10 focus:outline-none focus:ring-0 focus:ring-offset-0
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
