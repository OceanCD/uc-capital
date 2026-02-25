import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import yahooFinance from "yahoo-finance2";

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
        const { symbol, from, to } = input;
        
        // Fetch historical data using yahoo-finance2
        // We use '1d' interval for daily data
        const result = await yahooFinance.historical(symbol, {
          period1: from,
          period2: to,
          interval: "1d",
        });

        if (!result || result.length === 0) {
          throw new Error(`No data found for ${symbol} in the specified period.`);
        }

        // Return clean JSON: { "date": "2016-01-04", "adjClose": 192.34 }
        // yahoo-finance2 returns adjClose if available, otherwise we use close
        const history = result.map((item) => ({
          date: item.date.toISOString().split('T')[0],
          adjClose: item.adjClose || item.close,
        })).filter((item) => item.adjClose !== null && item.adjClose !== undefined);

        return history;
      } catch (error: any) {
        console.error(`Error fetching data for ${input.symbol}:`, error);
        // Handle specific yahoo-finance2 errors if needed
        if (error.name === 'YahooFinanceError') {
          throw new Error(`Yahoo Finance error: ${error.message}`);
        }
        throw new Error(error.message || "Failed to fetch historical data");
      }
    }),
});
