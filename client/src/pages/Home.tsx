/**
 * Home Page - Bloomberg Terminal Neo Style
 * Market overview, real-time stock prices, news analysis
 * Dark theme with gold accents, high information density
 */
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  BarChart3,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/YaP317eOKyuIkprNnugzm7/sandbox/Ac3WClDop2IEMcCR2v0NAv-img-1_1771981296000_na1fn_aGVyby1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWWFQMzE3ZU9LeXVJa3ByTm51Z3ptNy9zYW5kYm94L0FjM1dDbERvcDJJRU1jQ1IydjBOQXYtaW1nLTFfMTc3MTk4MTI5NjAwMF9uYTFmbl9hR1Z5YnkxaVp3LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=FCTVzl0wJQGA86lQKf6vji736Am6rFAEMGT2C-fEC-rZ9f8a8bpTof78Sfi1AXza3FMkez0VI0XP5igKzgjMDmNbNQrEMiMvd6Phh5gdAv2ipI18rTg3uvgbqxc0URQmWwMF29rxgNUCZLRvDLgwR0P91MJhiqO7MdSmnJX~hBDl5uFFExRfT7aRGuwUI-j85nJ-JHJqBq175d3HdZPzEJ0hG7ArrkPyzZWlEiW16rVTLYfeBy22QVNNT~0iznCBsUKED7vRyS~RFxETfytU6s9MyA236ZUrOgJ-FvFzRyLXxzD~ga7j06GnyrGWxTYS7Ov68T9bg30DpqV0zTmc2w__";

// Mock data
const marketIndices = [
  { name: "S&P 500", value: "5,983.25", change: "+1.24%", up: true, sparkline: [45, 48, 46, 52, 50, 55, 58, 56, 60, 62] },
  { name: "NASDAQ", value: "19,456.78", change: "+1.68%", up: true, sparkline: [40, 42, 38, 45, 48, 50, 52, 49, 55, 58] },
  { name: "道琼斯", value: "43,258.90", change: "+0.87%", up: true, sparkline: [50, 52, 48, 51, 53, 55, 54, 57, 56, 58] },
  { name: "恒生指数", value: "22,456.12", change: "-0.32%", up: false, sparkline: [55, 53, 56, 52, 50, 48, 51, 49, 47, 46] },
  { name: "上证综指", value: "3,345.67", change: "+0.56%", up: true, sparkline: [42, 44, 43, 46, 45, 48, 47, 50, 49, 51] },
  { name: "BTC/USD", value: "95,234.50", change: "+3.21%", up: true, sparkline: [30, 35, 32, 40, 38, 45, 50, 48, 55, 60] },
];

const topStocks = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: "138.25", change: "+4.52%", up: true, volume: "52.3M" },
  { symbol: "AAPL", name: "Apple Inc", price: "245.12", change: "+1.23%", up: true, volume: "38.7M" },
  { symbol: "MSFT", name: "Microsoft Corp", price: "425.89", change: "+0.95%", up: true, volume: "22.1M" },
  { symbol: "TSLA", name: "Tesla Inc", price: "342.56", change: "-2.15%", up: false, volume: "45.6M" },
  { symbol: "AMZN", name: "Amazon.com", price: "198.34", change: "+1.78%", up: true, volume: "28.9M" },
  { symbol: "META", name: "Meta Platforms", price: "612.45", change: "+2.34%", up: true, volume: "18.4M" },
  { symbol: "GOOGL", name: "Alphabet Inc", price: "178.90", change: "+0.67%", up: true, volume: "25.2M" },
  { symbol: "AMD", name: "AMD Inc", price: "162.78", change: "-1.45%", up: false, volume: "35.8M" },
];

const newsItems = [
  {
    time: "10:32",
    title: "美联储会议纪要释放鸽派信号，市场预期降息概率上升",
    source: "Reuters",
    sentiment: "positive",
    tag: "宏观",
  },
  {
    time: "09:45",
    title: "NVIDIA发布新一代AI芯片Blackwell Ultra，性能提升40%",
    source: "Bloomberg",
    sentiment: "positive",
    tag: "科技",
  },
  {
    time: "09:12",
    title: "中国PMI数据超预期，制造业连续三个月扩张",
    source: "CNBC",
    sentiment: "positive",
    tag: "宏观",
  },
  {
    time: "08:30",
    title: "特斯拉Q4交付量不及预期，盘前下跌2.5%",
    source: "WSJ",
    sentiment: "negative",
    tag: "个股",
  },
  {
    time: "08:15",
    title: "原油价格突破85美元，OPEC+维持减产决议",
    source: "FT",
    sentiment: "neutral",
    tag: "商品",
  },
  {
    time: "07:50",
    title: "苹果Vision Pro二代曝光，预计2026年Q3发布",
    source: "Bloomberg",
    sentiment: "positive",
    tag: "科技",
  },
];

const sectorData = [
  { name: "科技", value: 2.4 },
  { name: "医疗", value: 1.2 },
  { name: "金融", value: 0.8 },
  { name: "消费", value: -0.5 },
  { name: "能源", value: 1.8 },
  { name: "工业", value: 0.3 },
  { name: "材料", value: -0.2 },
  { name: "地产", value: -1.1 },
];

// Generate intraday chart data
const intradayData = Array.from({ length: 78 }, (_, i) => {
  const hour = 9 + Math.floor((i * 5) / 60);
  const min = (i * 5) % 60;
  const base = 5920;
  const noise = Math.sin(i * 0.15) * 30 + Math.random() * 15;
  const trend = i * 0.8;
  return {
    time: `${hour}:${min.toString().padStart(2, "0")}`,
    value: Math.round((base + trend + noise) * 100) / 100,
  };
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function MiniSparkline({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 60},${30 - ((v - min) / range) * 24}`)
    .join(" ");

  return (
    <svg width="60" height="30" viewBox="0 0 60 30" className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke={up ? "#22C55E" : "#EF4444"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SentimentDot({ sentiment }: { sentiment: string }) {
  const color =
    sentiment === "positive"
      ? "bg-profit"
      : sentiment === "negative"
      ? "bg-loss"
      : "bg-muted-foreground";
  return <div className={`w-2 h-2 rounded-full ${color}`} />;
}

export default function Home() {
  return (
    <div className="min-h-screen pt-[66px]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

        <div className="relative container py-10 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-5 h-5 text-gold" />
              <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                Market Dashboard
              </span>
              <div className="flex items-center gap-1.5 ml-auto">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date().toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}{" "}
                  美东时间
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-gold-gradient mb-2">
              全球市场概览
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              实时追踪全球主要市场指数、热门个股动态与宏观新闻，为您的投资决策提供数据支撑。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Market Indices Ticker */}
      <section className="border-y border-gold/10 bg-card/50">
        <div className="container">
          <div className="flex overflow-x-auto gap-0 py-0 -mx-4 px-4 md:mx-0 md:px-0">
            {marketIndices.map((idx, i) => (
              <motion.div
                key={idx.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 px-5 py-3 border-r border-gold/10 last:border-r-0 min-w-[180px]"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {idx.name}
                  </div>
                  <div className="text-sm font-mono font-semibold text-foreground tabular-nums">
                    {idx.value}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <MiniSparkline data={idx.sparkline} up={idx.up} />
                  <span
                    className={`text-xs font-mono font-medium tabular-nums ${
                      idx.up ? "text-profit" : "text-loss"
                    }`}
                  >
                    {idx.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <motion.div
        className="container py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column - Chart + Stocks (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Intraday Chart */}
            <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gold" />
                  <h2 className="font-mono font-semibold text-sm text-foreground">
                    S&P 500 日内走势
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-mono font-bold text-foreground tabular-nums">
                    5,983.25
                  </span>
                  <span className="text-sm font-mono text-profit flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +1.24%
                  </span>
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={intradayData}>
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D4A853" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#D4A853" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(212,168,83,0.08)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "JetBrains Mono" }}
                      axisLine={{ stroke: "rgba(212,168,83,0.15)" }}
                      tickLine={false}
                      interval={15}
                    />
                    <YAxis
                      domain={["dataMin - 10", "dataMax + 10"]}
                      tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "JetBrains Mono" }}
                      axisLine={false}
                      tickLine={false}
                      width={55}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(17, 24, 39, 0.95)",
                        border: "1px solid rgba(212,168,83,0.3)",
                        borderRadius: "6px",
                        fontFamily: "JetBrains Mono",
                        fontSize: "12px",
                        color: "#e5e7eb",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#D4A853"
                      strokeWidth={2}
                      fill="url(#goldGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Hot Stocks Table */}
            <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gold" />
                  <h2 className="font-mono font-semibold text-sm text-foreground">
                    热门个股
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground font-mono">实时行情</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/10">
                      <th className="text-left py-2 px-2 text-xs font-mono text-muted-foreground font-medium">
                        代码
                      </th>
                      <th className="text-left py-2 px-2 text-xs font-mono text-muted-foreground font-medium">
                        名称
                      </th>
                      <th className="text-right py-2 px-2 text-xs font-mono text-muted-foreground font-medium">
                        价格
                      </th>
                      <th className="text-right py-2 px-2 text-xs font-mono text-muted-foreground font-medium">
                        涨跌幅
                      </th>
                      <th className="text-right py-2 px-2 text-xs font-mono text-muted-foreground font-medium hidden sm:table-cell">
                        成交量
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topStocks.map((stock, i) => (
                      <motion.tr
                        key={stock.symbol}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="border-b border-gold/5 hover:bg-gold/5 transition-colors"
                      >
                        <td className="py-2.5 px-2">
                          <span className="font-mono font-semibold text-sm text-gold">
                            {stock.symbol}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-sm text-muted-foreground">
                          {stock.name}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-sm tabular-nums text-foreground">
                          ${stock.price}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <span
                            className={`inline-flex items-center gap-0.5 font-mono text-sm tabular-nums ${
                              stock.up ? "text-profit" : "text-loss"
                            }`}
                          >
                            {stock.up ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {stock.change}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-xs text-muted-foreground hidden sm:table-cell tabular-nums">
                          {stock.volume}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Sector Performance */}
            <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-gold" />
                <h2 className="font-mono font-semibold text-sm text-foreground">
                  板块表现
                </h2>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(212,168,83,0.08)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "JetBrains Mono" }}
                      axisLine={{ stroke: "rgba(212,168,83,0.15)" }}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "JetBrains Mono" }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(17, 24, 39, 0.95)",
                        border: "1px solid rgba(212,168,83,0.3)",
                        borderRadius: "6px",
                        fontFamily: "JetBrains Mono",
                        fontSize: "12px",
                        color: "#e5e7eb",
                      }}
                      formatter={(value: number) => [`${value}%`, "涨跌幅"]}
                    />
                    <Bar
                      dataKey="value"
                      radius={[0, 4, 4, 0]}
                      fill="#D4A853"
                      // @ts-ignore
                      shape={(props: any) => {
                        const { x, y, width, height, value } = props;
                        const isNeg = value < 0;
                        return (
                          <rect
                            x={isNeg ? x + width : x}
                            y={y}
                            width={Math.abs(width)}
                            height={height}
                            rx={3}
                            fill={isNeg ? "#EF4444" : "#D4A853"}
                            opacity={0.8}
                          />
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Right Column - News + CTA */}
          <div className="space-y-5">
            {/* Portfolio CTA */}
            <motion.div variants={itemVariants}>
              <Link href="/portfolio">
                <div className="card-gold rounded-lg bg-gradient-to-br from-gold/10 to-gold/5 p-5 group cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-gold" />
                    <span className="font-mono font-semibold text-sm text-gold">
                      旗舰组合
                    </span>
                    <ChevronRight className="w-4 h-4 text-gold ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-mono font-bold text-gold-gradient tabular-nums">
                      +32.8%
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">年化收益</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-profit/20 text-profit">
                      超额 +12.4%
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">vs S&P 500</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    查看完整组合表现、持仓明细与行业分布 →
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* News Feed */}
            <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-4 h-4 text-gold" />
                <h2 className="font-mono font-semibold text-sm text-foreground">
                  实时新闻
                </h2>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-profit data-pulse" />
                  <span className="text-[10px] font-mono text-muted-foreground">LIVE</span>
                </div>
              </div>
              <div className="space-y-0">
                {newsItems.map((news, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex gap-3 py-3 border-b border-gold/5 last:border-b-0 hover:bg-gold/5 -mx-2 px-2 rounded transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-1 pt-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {news.time}
                      </span>
                      <SentimentDot sentiment={news.sentiment} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug line-clamp-2">
                        {news.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono text-gold/70 px-1.5 py-0.5 rounded border border-gold/15">
                          {news.tag}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {news.source}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Market Stats */}
            <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-gold" />
                <h2 className="font-mono font-semibold text-sm text-foreground">
                  市场情绪
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-mono">VIX 恐慌指数</span>
                  <span className="text-sm font-mono text-profit tabular-nums">14.32</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "28%",
                      background: "linear-gradient(90deg, #22C55E, #D4A853)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>低波动</span>
                  <span>高波动</span>
                </div>

                <div className="border-t border-gold/10 pt-3 mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground font-mono">10Y 美债收益率</span>
                    <span className="text-sm font-mono text-foreground tabular-nums">4.28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground font-mono">美元指数 DXY</span>
                    <span className="text-sm font-mono text-foreground tabular-nums">104.52</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground font-mono">黄金 XAU/USD</span>
                    <span className="text-sm font-mono text-gold tabular-nums">$2,935.40</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground font-mono">原油 WTI</span>
                    <span className="text-sm font-mono text-foreground tabular-nums">$78.45</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="border-t border-gold/10 mt-8">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              &copy; 2025 UC Capital. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-muted-foreground">
              数据仅供参考，不构成投资建议
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
