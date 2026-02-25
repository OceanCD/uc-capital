import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { callDataApi } from "../_core/dataApi";

export const dcaRouter = router({
  getHistoricalData: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        from: z.string(), // YYYY-MM-DD
        to: z.string(),   // YYYY-MM-DD
      })
    )
    .query(async ({ input }) => {
      try {
        // Using Yahoo Finance API via callDataApi
        const result = await callDataApi("YahooFinance/chart", {
          pathParams: { symbol: input.symbol },
          query: {
            period1: Math.floor(new Date(input.from).getTime() / 1000),
            period2: Math.floor(new Date(input.to).getTime() / 1000),
            interval: "1d",
          },
        }) as any;

        if (!result || !result.chart || !result.chart.result || result.chart.result.length === 0) {
          throw new Error(`No data found for ${input.symbol}`);
        }

        const data = result.chart.result[0];
        const timestamps = data.timestamp;
        const quotes = data.indicators.quote[0];
        const adjClose = data.indicators.adjclose?.[0]?.adjclose || quotes.close;

        const history = timestamps.map((ts: number, i: number) => ({
          date: new Date(ts * 1000).toISOString().split('T')[0],
          price: adjClose[i],
        })).filter((item: any) => item.price !== null);

        return history;
      } catch (error: any) {
        console.error(`Error fetching data for ${input.symbol}:`, error);
        throw new Error(error.message || "Failed to fetch historical data");
      }
    }),
});
