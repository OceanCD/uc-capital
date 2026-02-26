import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Calendar as CalendarIcon,
  Plus,
  X,
  Download,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  LineChart as LineChartIcon,
  Table as TableIcon,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, subYears, isBefore, addWeeks, addMonths, parseISO, differenceInDays } from "date-fns";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip as ShadedTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Frequency = "weekly" | "bi-weekly" | "monthly" | "quarterly";

interface DCAStats {
  symbol: string;
  totalInvested: number;
  finalValue: number;
  totalReturn: number;
  cagr: number;
  purchases: number;
  maxDrawdown: number;
  isLumpSum?: boolean;
}

export default function DCAPowerhouse() {
  const [amount, setAmount] = useState<number>(1000);
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [startDate, setStartDate] = useState<Date>(subYears(new Date(), 10));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [tickerInput, setTickerInput] = useState("");
  const [tickers, setTickers] = useState<string[]>(["2800.HK", "SPY", "QQQ"]);
  const [compareLumpSum, setCompareLumpSum] = useState(true);

  const [results, setResults] = useState<{
    chartData: any[];
    stats: DCAStats[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const utils = trpc.useUtils();

  const addTicker = () => {
    const t = tickerInput.trim().toUpperCase();
    if (t && !tickers.includes(t)) {
      setTickers([...tickers, t]);
      setTickerInput("");
    }
  };

  const removeTicker = (t: string) => {
    setTickers(tickers.filter((ticker) => ticker !== t));
  };

  const runBacktest = async () => {
    if (tickers.length === 0) {
      toast.error("Please add at least one ticker");
      return;
    }

    setLoading(true);
    try {
      const allData = await Promise.all(
        tickers.map(async (symbol) => {
          try {
            // Try tRPC first, fall back to standalone API
            let data: { date: string; adjClose: number }[] = [];
            try {
              data = await utils.client.dca.getHistoricalData.query({
                symbol,
                from: format(startDate, "yyyy-MM-dd"),
                to: format(endDate, "yyyy-MM-dd"),
              });
            } catch {
              // Fallback to standalone API endpoint (for Vercel serverless)
              const res = await fetch(
                `/api/dca?symbol=${encodeURIComponent(symbol)}&from=${format(startDate, "yyyy-MM-dd")}&to=${format(endDate, "yyyy-MM-dd")}`
              );
              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `HTTP ${res.status}`);
              }
              data = await res.json();
            }
            return { symbol, data };
          } catch (err) {
            console.error(`Error fetching ${symbol}:`, err);
            toast.error(`Failed to fetch data for ${symbol}`);
            return { symbol, data: [] };
          }
        })
      );

      const validData = allData.filter(d => d.data.length > 0);
      if (validData.length === 0) {
        throw new Error("No valid data found for any of the tickers.");
      }

      const stats: DCAStats[] = [];
      const chartDataMap: Record<string, any> = {};

      validData.forEach(({ symbol, data }) => {
        const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // DCA Strategy
        let dcaTotalInvested = 0;
        let dcaTotalShares = 0;
        let dcaPurchases = 0;
        let dcaMaxPortfolioValue = 0;
        let dcaMaxDrawdown = 0;
        
        let nextPurchaseDate = startDate;

        // Lump Sum Strategy
        let lsTotalInvested = 0;
        let lsTotalShares = 0;
        let lsMaxPortfolioValue = 0;
        let lsMaxDrawdown = 0;
        let lsInitialized = false;

        sortedData.forEach((day, index) => {
          const currentDate = parseISO(day.date);
          const price = day.adjClose;

          // DCA Logic
          if (!isBefore(currentDate, nextPurchaseDate)) {
            dcaTotalInvested += amount;
            dcaTotalShares += amount / price;
            dcaPurchases++;

            if (frequency === "weekly") nextPurchaseDate = addWeeks(nextPurchaseDate, 1);
            else if (frequency === "bi-weekly") nextPurchaseDate = addWeeks(nextPurchaseDate, 2);
            else if (frequency === "monthly") nextPurchaseDate = addMonths(nextPurchaseDate, 1);
            else if (frequency === "quarterly") nextPurchaseDate = addMonths(nextPurchaseDate, 3);
          }

          const dcaCurrentValue = dcaTotalShares * price;
          if (dcaCurrentValue > dcaMaxPortfolioValue) dcaMaxPortfolioValue = dcaCurrentValue;
          const dcaDD = dcaMaxPortfolioValue > 0 ? (dcaMaxPortfolioValue - dcaCurrentValue) / dcaMaxPortfolioValue : 0;
          if (dcaDD > dcaMaxDrawdown) dcaMaxDrawdown = dcaDD;

          // Lump Sum Logic (Invest all at once on the first available day)
          if (compareLumpSum) {
            if (!lsInitialized) {
              // We need to know total DCA investment to compare fairly
              // But we don't know it until the end. 
              // Usually Lump Sum comparison means investing the SAME total amount at the start.
              // Let's estimate total investment or just use a fixed large amount.
              // A better way: Calculate total DCA investment first, then run LS.
            }
          }

          if (!chartDataMap[day.date]) chartDataMap[day.date] = { date: day.date };
          chartDataMap[day.date][symbol] = Math.round(dcaCurrentValue * 100) / 100;
        });

        // Finalize DCA Stats
        const dcaFinalValue = dcaTotalShares * sortedData[sortedData.length - 1].adjClose;
        const dcaTotalReturn = ((dcaFinalValue - dcaTotalInvested) / dcaTotalInvested) * 100;
        const years = differenceInDays(parseISO(sortedData[sortedData.length - 1].date), parseISO(sortedData[0].date)) / 365.25;
        const dcaCagr = (Math.pow(dcaFinalValue / dcaTotalInvested, 1 / years) - 1) * 100;

        stats.push({
          symbol,
          totalInvested: dcaTotalInvested,
          finalValue: dcaFinalValue,
          totalReturn: dcaTotalReturn,
          cagr: dcaCagr,
          purchases: dcaPurchases,
          maxDrawdown: dcaMaxDrawdown * 100,
        });

        // Lump Sum Comparison (Fair comparison: invest total DCA amount at start)
        if (compareLumpSum) {
          const lsTotalInvestedVal = dcaTotalInvested;
          const lsInitialPrice = sortedData[0].adjClose;
          const lsShares = lsTotalInvestedVal / lsInitialPrice;
          
          let lsMaxVal = 0;
          let lsMaxDD = 0;
          
          sortedData.forEach((day) => {
            const val = lsShares * day.adjClose;
            if (val > lsMaxVal) lsMaxVal = val;
            const dd = (lsMaxVal - val) / lsMaxVal;
            if (dd > lsMaxDD) lsMaxDD = dd;
            
            const lsKey = `${symbol} (LS)`;
            chartDataMap[day.date][lsKey] = Math.round(val * 100) / 100;
          });

          const lsFinalValue = lsShares * sortedData[sortedData.length - 1].adjClose;
          const lsTotalReturn = ((lsFinalValue - lsTotalInvestedVal) / lsTotalInvestedVal) * 100;
          const lsCagr = (Math.pow(lsFinalValue / lsTotalInvestedVal, 1 / years) - 1) * 100;

          stats.push({
            symbol: `${symbol} (LS)`,
            totalInvested: lsTotalInvestedVal,
            finalValue: lsFinalValue,
            totalReturn: lsTotalReturn,
            cagr: lsCagr,
            purchases: 1,
            maxDrawdown: lsMaxDD * 100,
            isLumpSum: true,
          });
        }
      });

      const chartData = Object.values(chartDataMap).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setResults({ chartData, stats });
      toast.success("Backtest completed!");
    } catch (error: any) {
      toast.error(error.message || "Failed to run backtest");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!results) return;
    const headers = ["Symbol", "Type", "Total Invested", "Final Value", "Total Return %", "CAGR %", "Purchases", "Max Drawdown %"];
    const rows = results.stats.map(s => [
      s.symbol,
      s.isLumpSum ? "Lump Sum" : "DCA",
      s.totalInvested.toFixed(2),
      s.finalValue.toFixed(2),
      s.totalReturn.toFixed(2),
      s.cagr.toFixed(2),
      s.purchases,
      s.maxDrawdown.toFixed(2)
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `dca_results_${format(new Date(), "yyyyMMdd")}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const bestTicker = useMemo(() => {
    if (!results) return null;
    return [...results.stats].sort((a, b) => b.totalReturn - a.totalReturn)[0];
  }, [results]);

  const colors = ["#D4A853", "#22C55E", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4"];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gold flex items-center gap-2">
          <Calculator className="w-8 h-8" />
          DCA Powerhouse
        </h1>
        <p className="text-muted-foreground">
          Compare Dollar-Cost Averaging vs Lump Sum strategies with real historical data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-4 border-gold/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Strategy Configuration</CardTitle>
            <CardDescription>Define your investment parameters</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label>Tickers (US or HK)</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. SPY, 2800.HK, BTC-USD" 
                  value={tickerInput}
                  onChange={(e) => setTickerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTicker()}
                  className="bg-background/50"
                />
                <Button size="icon" onClick={addTicker} variant="outline" className="border-gold/30 hover:bg-gold/10">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tickers.map(t => (
                  <div key={t} className="flex items-center gap-1 bg-gold/10 text-gold px-2 py-1 rounded-md text-xs font-medium border border-gold/20">
                    {t}
                    <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => removeTicker(t)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>DCA Amount ($)</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setAmount(Math.max(10, amount - 100))} className="h-8 w-8">-</Button>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="text-center bg-background/50"
                />
                <Button variant="outline" size="icon" onClick={() => setAmount(amount + 100)} className="h-8 w-8">+</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v: Frequency) => setFrequency(v)}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-background/50">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, "PP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(d) => d && setStartDate(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-background/50">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, "PP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(d) => d && setEndDate(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <input 
                type="checkbox" 
                id="lumpsum" 
                checked={compareLumpSum} 
                onChange={(e) => setCompareLumpSum(e.target.checked)}
                className="w-4 h-4 rounded border-gold/30 text-gold focus:ring-gold bg-background/50"
              />
              <Label htmlFor="lumpsum" className="cursor-pointer">Compare to Lump Sum</Label>
            </div>

            <Button 
              className="w-full mt-2 bg-gold hover:bg-gold/90 text-black font-bold shadow-lg shadow-gold/20"
              onClick={runBacktest}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : "Run Backtest"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!results ? (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gold/10 rounded-xl p-12 text-center bg-card/20">
              <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center mb-4">
                <LineChartIcon className="w-8 h-8 text-gold/40" />
              </div>
              <h3 className="text-xl font-semibold text-foreground/70">Ready to analyze</h3>
              <p className="text-muted-foreground max-w-xs mt-2">
                Configure your strategy and click "Run Backtest" to see real historical performance.
              </p>
            </div>
          ) : (
            <>
              {/* Summary Card */}
              {bestTicker && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-gold font-medium uppercase tracking-wider">Top Performer</p>
                          <h3 className="text-2xl font-bold">{bestTicker.symbol}</h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Return</p>
                        <p className="text-3xl font-bold text-green-500">+{bestTicker.totalReturn.toFixed(2)}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Chart */}
              <Card className="border-gold/10 bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Equity Curve</CardTitle>
                    <CardDescription>Portfolio value over time (USD)</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={exportCSV} className="text-gold hover:text-gold hover:bg-gold/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,83,0.1)" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280" 
                        fontSize={12} 
                        tickFormatter={(str) => format(parseISO(str), "MMM yy")}
                        minTickGap={30}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        fontSize={12} 
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0e17', borderColor: 'rgba(212,168,83,0.3)', borderRadius: '8px' }}
                        labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
                        labelFormatter={(label) => format(parseISO(label as string), "PPP")}
                      />
                      <Legend />
                      {results.stats.map((s, i) => (
                        <Line 
                          key={s.symbol}
                          type="monotone" 
                          dataKey={s.symbol} 
                          stroke={colors[i % colors.length]} 
                          strokeWidth={s.isLumpSum ? 1 : 2} 
                          strokeDasharray={s.isLumpSum ? "5 5" : "0"}
                          dot={false}
                          activeDot={{ r: 4, strokeWidth: 0 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Metrics Table */}
              <Card className="border-gold/10 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TableIcon className="w-5 h-5 text-gold" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-gold/10">
                          <TableHead>Strategy</TableHead>
                          <TableHead className="text-right">Invested</TableHead>
                          <TableHead className="text-right">Final Value</TableHead>
                          <TableHead className="text-right">Return</TableHead>
                          <TableHead className="text-right">CAGR</TableHead>
                          <TableHead className="text-right">Max DD</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.stats.map((s, i) => (
                          <TableRow key={s.symbol} className="border-gold/5 hover:bg-gold/5">
                            <TableCell className="font-bold">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                                <div className="flex flex-col">
                                  <span>{s.symbol}</span>
                                  <span className="text-[10px] text-muted-foreground font-normal">
                                    {s.isLumpSum ? "Lump Sum" : `DCA ${frequency}`}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">${s.totalInvested.toLocaleString()}</TableCell>
                            <TableCell className="text-right tabular-nums font-medium">${s.finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className={cn("text-right tabular-nums font-bold", s.totalReturn >= 0 ? "text-green-500" : "text-red-500")}>
                              {s.totalReturn >= 0 ? "+" : ""}{s.totalReturn.toFixed(2)}%
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{s.cagr.toFixed(2)}%</TableCell>
                            <TableCell className="text-right tabular-nums text-red-400">-{s.maxDrawdown.toFixed(2)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Educational Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <TooltipProvider>
          <Card className="bg-gold/5 border-gold/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShadedTooltip>
                  <TooltipTrigger><Info className="w-4 h-4 text-gold" /></TooltipTrigger>
                  <TooltipContent>Dollar-Cost Averaging strategy details</TooltipContent>
                </ShadedTooltip>
                What is DCA?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dollar-Cost Averaging (DCA) is an investment strategy where you invest a fixed amount of money at regular intervals. This helps reduce the impact of volatility by buying more shares when prices are low and fewer when prices are high.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gold/5 border-gold/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShadedTooltip>
                  <TooltipTrigger><ArrowUpRight className="w-4 h-4 text-gold" /></TooltipTrigger>
                  <TooltipContent>Compound Annual Growth Rate</TooltipContent>
                </ShadedTooltip>
                Why CAGR?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Compound Annual Growth Rate (CAGR) represents the mean annual growth rate of an investment over a period. It provides a "smoothed" annual return, making it easier to compare different assets or strategies.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gold/5 border-gold/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShadedTooltip>
                  <TooltipTrigger><ArrowDownRight className="w-4 h-4 text-gold" /></TooltipTrigger>
                  <TooltipContent>Maximum Peak-to-Trough Decline</TooltipContent>
                </ShadedTooltip>
                Max Drawdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Max Drawdown is the maximum observed loss from a peak to a trough of a portfolio. It's a critical indicator of downside risk and helps investors understand the potential "pain" of a strategy.
              </p>
            </CardContent>
          </Card>
        </TooltipProvider>
      </div>
    </div>
  );
}
