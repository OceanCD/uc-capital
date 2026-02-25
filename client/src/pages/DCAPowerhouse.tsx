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
import { format, subYears, isBefore, isAfter, startOfMonth, addWeeks, addMonths, addDays } from "date-fns";
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
}

export default function DCAPowerhouse() {
  const [amount, setAmount] = useState<number>(100);
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [startDate, setStartDate] = useState<Date>(subYears(new Date(), 10));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [tickerInput, setTickerInput] = useState("");
  const [tickers, setTickers] = useState<string[]>(["VTI", "QQQ"]);
  const [compareLumpSum, setCompareLumpSum] = useState(false);

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
          const data = await utils.client.dca.getHistoricalData.query({
            symbol,
            from: format(startDate, "yyyy-MM-dd"),
            to: format(endDate, "yyyy-MM-dd"),
          });
          return { symbol, data };
        })
      );

      // Process DCA for each ticker
      const stats: DCAStats[] = [];
      const chartDataMap: Record<string, any> = {};

      allData.forEach(({ symbol, data }) => {
        if (data.length === 0) return;

        let totalInvested = 0;
        let totalShares = 0;
        let purchases = 0;
        let maxPortfolioValue = 0;
        let maxDrawdown = 0;

        const tickerChartData: { date: string; value: number }[] = [];
        
        let nextPurchaseDate = startDate;
        const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sortedData.forEach((day) => {
          const currentDate = new Date(day.date);
          
          if (!isBefore(currentDate, nextPurchaseDate)) {
            totalInvested += amount;
            totalShares += amount / day.price;
            purchases++;

            // Set next purchase date
            if (frequency === "weekly") nextPurchaseDate = addWeeks(nextPurchaseDate, 1);
            else if (frequency === "bi-weekly") nextPurchaseDate = addWeeks(nextPurchaseDate, 2);
            else if (frequency === "monthly") nextPurchaseDate = addMonths(nextPurchaseDate, 1);
            else if (frequency === "quarterly") nextPurchaseDate = addMonths(nextPurchaseDate, 3);
          }

          const currentValue = totalShares * day.price;
          tickerChartData.push({ date: day.date, value: currentValue });

          if (currentValue > maxPortfolioValue) maxPortfolioValue = currentValue;
          const dd = maxPortfolioValue > 0 ? (maxPortfolioValue - currentValue) / maxPortfolioValue : 0;
          if (dd > maxDrawdown) maxDrawdown = dd;
        });

        const finalValue = totalShares * sortedData[sortedData.length - 1].price;
        const totalReturn = ((finalValue - totalInvested) / totalInvested) * 100;
        
        // CAGR calculation
        const years = sortedData.length / 252; // Approx trading days
        const cagr = (Math.pow(finalValue / totalInvested, 1 / years) - 1) * 100;

        stats.push({
          symbol,
          totalInvested,
          finalValue,
          totalReturn,
          cagr,
          purchases,
          maxDrawdown: maxDrawdown * 100,
        });

        tickerChartData.forEach(d => {
          if (!chartDataMap[d.date]) chartDataMap[d.date] = { date: d.date };
          chartDataMap[d.date][symbol] = Math.round(d.value * 100) / 100;
        });
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
    const headers = ["Symbol", "Total Invested", "Final Value", "Total Return %", "CAGR %", "Purchases", "Max Drawdown %"];
    const rows = results.stats.map(s => [
      s.symbol,
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

  const colors = ["#D4A853", "#22C55E", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gold flex items-center gap-2">
          <Calculator className="w-8 h-8" />
          DCA Powerhouse
        </h1>
        <p className="text-muted-foreground">
          Run advanced Dollar-Cost Averaging backtests to discover the most effective investment strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-4 border-gold/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Strategy Configuration</CardTitle>
            <CardDescription>Define your DCA parameters</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label>Tickers</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. VTI, AAPL, BTC-USD" 
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
                <Button variant="outline" size="icon" onClick={() => setAmount(Math.max(50, amount - 50))} className="h-8 w-8">-</Button>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="text-center bg-background/50"
                />
                <Button variant="outline" size="icon" onClick={() => setAmount(amount + 50)} className="h-8 w-8">+</Button>
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

            <Button 
              className="w-full mt-4 bg-gold hover:bg-gold/90 text-black font-bold shadow-lg shadow-gold/20"
              onClick={runBacktest}
              disabled={loading}
            >
              {loading ? "Calculating..." : "Run Backtest"}
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
                Configure your strategy on the left and click "Run Backtest" to see the results.
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
                        <p className="text-3xl font-bold text-profit">+{bestTicker.totalReturn.toFixed(2)}%</p>
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
                    <CardDescription>Portfolio value over time</CardDescription>
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
                        tickFormatter={(str) => format(new Date(str), "MMM yy")}
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
                      />
                      <Legend />
                      {tickers.map((t, i) => (
                        <Line 
                          key={t}
                          type="monotone" 
                          dataKey={t} 
                          stroke={colors[i % colors.length]} 
                          strokeWidth={2} 
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
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-gold/10">
                        <TableHead>Ticker</TableHead>
                        <TableHead className="text-right">Total Invested</TableHead>
                        <TableHead className="text-right">Final Value</TableHead>
                        <TableHead className="text-right">Total Return</TableHead>
                        <TableHead className="text-right">CAGR</TableHead>
                        <TableHead className="text-right">Drawdown</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.stats.map((s, i) => (
                        <TableRow key={s.symbol} className="border-gold/5 hover:bg-gold/5">
                          <TableCell className="font-bold flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                            {s.symbol}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">${s.totalInvested.toLocaleString()}</TableCell>
                          <TableCell className="text-right tabular-nums font-medium">${s.finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                          <TableCell className={cn("text-right tabular-nums font-bold", s.totalReturn >= 0 ? "text-profit" : "text-loss")}>
                            {s.totalReturn >= 0 ? "+" : ""}{s.totalReturn.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right tabular-nums">{s.cagr.toFixed(2)}%</TableCell>
                          <TableCell className="text-right tabular-nums text-loss">-{s.maxDrawdown.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Educational Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <Card className="bg-gold/5 border-gold/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-gold" />
              What is DCA?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dollar-Cost Averaging (DCA) is an investment strategy where you invest a fixed amount of money at regular intervals, regardless of the asset's price. This helps reduce the impact of volatility.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gold/5 border-gold/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-gold" />
              Why CAGR?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Compound Annual Growth Rate (CAGR) represents the mean annual growth rate of an investment over a specified period of time longer than one year. It provides a "smoothed" annual return.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gold/5 border-gold/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-gold" />
              Max Drawdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Max Drawdown is the maximum observed loss from a peak to a trough of a portfolio, before a new peak is attained. it's a key indicator of downside risk.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
