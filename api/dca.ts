import type { VercelRequest, VercelResponse } from "@vercel/node";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["ripHistorical"] });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { symbol, from, to } = req.query;

  if (!symbol || !from || !to) {
    return res.status(400).json({
      error: "Missing required parameters: symbol, from, to",
    });
  }

  try {
    const result = await yahooFinance.historical(String(symbol), {
      period1: String(from),
      period2: String(to),
      interval: "1d",
    });

    if (!result || result.length === 0) {
      return res.status(404).json({
        error: `No data found for ${symbol} in the specified period.`,
      });
    }

    const history = result
      .map((item: any) => ({
        date: new Date(item.date).toISOString().split("T")[0],
        adjClose: item.adjClose ?? item.close,
      }))
      .filter(
        (item: any) => item.adjClose !== null && item.adjClose !== undefined
      );

    return res.status(200).json(history);
  } catch (error: any) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return res.status(500).json({
      error: error.message || "Failed to fetch historical data",
    });
  }
}
