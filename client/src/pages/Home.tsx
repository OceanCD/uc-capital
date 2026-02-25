/**
 * Home Page - UC Capital Smart Investment Terminal
 * Bloomberg Terminal Neo Style - Dark theme with gold accents
 * Features:
 * - Market indices ticker
 * - Intraday chart
 * - Stock list with click-to-detail modal (PE/PB/narrative/earnings)
 * - News module: 4-tier hierarchy + transmission chain + stock impact + 5+5 fold
 * - Daily market analysis: sentiment/fundamentals/technicals/weekly forecast
 * - Market stats sidebar
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  Crosshair,
  BookOpen,
  Brain,
  Eye,
  Target,
  AlertTriangle,
  TrendingUp as TrendUp,
  Layers,
  Link2,
  Filter,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/YaP317eOKyuIkprNnugzm7/sandbox/Ac3WClDop2IEMcCR2v0NAv-img-1_1771981296000_na1fn_aGVyby1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWWFQMzE3ZU9LeXVJa3ByTm51Z3ptNy9zYW5kYm94L0FjM1dDbERvcDJJRU1jQ1IydjBOQXYtaW1nLTFfMTc3MTk4MTI5NjAwMF9uYTFmbl9hR1Z5YnkxaVp3LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=FCTVzl0wJQGA86lQKf6vji736Am6rFAEMGT2C-fEC-rZ9f8a8bpTof78Sfi1AXza3FMkez0VI0XP5igKzgjMDmNbNQrEMiMvd6Phh5gdAv2ipI18rTg3uvgbqxc0URQmWwMF29rxgNUCZLRvDLgwR0P91MJhiqO7MdSmnJX~hBDl5uFFExRfT7aRGuwUI-j85nJ-JHJqBq175d3HdZPzEJ0hG7ArrkPyzZWlEiW16rVTLYfeBy22QVNNT~0iznCBsUKED7vRyS~RFxETfytU6s9MyA236ZUrOgJ-FvFzRyLXxzD~ga7j06GnyrGWxTYS7Ov68T9bg30DpqV0zTmc2w__";

// ─── Market Indices ───
const marketIndices = [
  { name: "S&P 500", value: "5,983.25", change: "+1.24%", up: true, sparkline: [45, 48, 46, 52, 50, 55, 58, 56, 60, 62] },
  { name: "NASDAQ", value: "19,456.78", change: "+1.68%", up: true, sparkline: [40, 42, 38, 45, 48, 50, 52, 49, 55, 58] },
  { name: "道琼斯", value: "43,258.90", change: "+0.87%", up: true, sparkline: [50, 52, 48, 51, 53, 55, 54, 57, 56, 58] },
  { name: "恒生指数", value: "22,456.12", change: "-0.32%", up: false, sparkline: [55, 53, 56, 52, 50, 48, 51, 49, 47, 46] },
  { name: "上证综指", value: "3,345.67", change: "+0.56%", up: true, sparkline: [42, 44, 43, 46, 45, 48, 47, 50, 49, 51] },
  { name: "BTC/USD", value: "95,234.50", change: "+3.21%", up: true, sparkline: [30, 35, 32, 40, 38, 45, 50, 48, 55, 60] },
];

// ─── Top Stocks with full detail data ───
interface StockDetail {
  symbol: string;
  name: string;
  price: string;
  change: string;
  up: boolean;
  volume: string;
  pe: string;
  pb: string;
  marketCap: string;
  narrative: string;
  earnings: string;
}

const topStocks: StockDetail[] = [
  {
    symbol: "NVDA", name: "NVIDIA Corp", price: "138.25", change: "+4.52%", up: true, volume: "52.3M",
    pe: "55.2x", pb: "42.8x", marketCap: "$3.4T",
    narrative: "AI算力基础设施的绝对垄断者。Blackwell架构GPU供不应求，数据中心收入同比增长150%+，云厂商资本开支持续加码确保未来2-3年需求可见性极高。",
    earnings: "FY25Q4营收$393亿，超预期8%。数据中心收入$356亿创新高，毛利率74.5%。管理层上调下季指引至$430亿，Blackwell产能爬坡顺利。"
  },
  {
    symbol: "AAPL", name: "Apple Inc", price: "245.12", change: "+1.23%", up: true, volume: "38.7M",
    pe: "32.8x", pb: "52.1x", marketCap: "$3.7T",
    narrative: "全球最强消费科技生态。iPhone 16系列搭载Apple Intelligence推动换机潮，服务业务收入占比持续提升至25%+，高毛利率改善整体盈利质量。",
    earnings: "FY25Q1营收$1243亿，同比+4%。iPhone收入$693亿略超预期，服务业务$268亿创历史新高，大中华区恢复增长+11%。"
  },
  {
    symbol: "MSFT", name: "Microsoft Corp", price: "425.89", change: "+0.95%", up: true, volume: "22.1M",
    pe: "35.6x", pb: "12.3x", marketCap: "$3.2T",
    narrative: "企业AI转型的最大受益者。Azure云增速重新加速至30%+，Copilot商业化进入收获期，Office 365渗透率持续提升，企业级AI护城河深厚。",
    earnings: "FY25Q2营收$696亿，超预期3%。Azure增长31%（含AI贡献13pct），Copilot付费用户突破200万，智能云毛利率提升至72%。"
  },
  {
    symbol: "TSLA", name: "Tesla Inc", price: "342.56", change: "-2.15%", up: false, volume: "45.6M",
    pe: "85.3x", pb: "18.5x", marketCap: "$1.1T",
    narrative: "电动车+自动驾驶+能源+AI机器人的多元叙事。FSD V13推送进展顺利，Robotaxi 2026年量产预期，但短期汽车交付量增速放缓，竞争加剧压制毛利率。",
    earnings: "Q4营收$257亿，略低于预期。汽车毛利率17.6%环比下降，交付量49.5万辆不及预期。能源业务收入$30亿增长67%成为亮点。"
  },
  {
    symbol: "AMZN", name: "Amazon.com", price: "198.34", change: "+1.78%", up: true, volume: "28.9M",
    pe: "42.5x", pb: "8.7x", marketCap: "$2.1T",
    narrative: "AWS云计算+电商双轮驱动。AWS受益于企业AI工作负载迁移，增速重回20%+；北美电商利润率持续改善，广告业务成为第三增长极。",
    earnings: "Q4营收$1878亿，超预期2%。AWS收入$289亿增长19%，运营利润率创新高达11.2%，广告业务增长27%至$173亿。"
  },
  {
    symbol: "META", name: "Meta Platforms", price: "612.45", change: "+2.34%", up: true, volume: "18.4M",
    pe: "25.3x", pb: "8.2x", marketCap: "$1.6T",
    narrative: "社交广告AI化的领跑者。Advantage+智能广告系统大幅提升ROI，Reels变现效率追平Stories，Llama开源模型构建AI生态，用户时长持续增长。",
    earnings: "Q4营收$484亿，超预期4%。广告收入增长21%，Reels年化营收超$100亿，DAP达33.5亿人。2026年资本开支指引$60-65B用于AI基础设施。"
  },
  {
    symbol: "GOOGL", name: "Alphabet Inc", price: "178.90", change: "+0.67%", up: true, volume: "25.2M",
    pe: "22.8x", pb: "7.1x", marketCap: "$2.2T",
    narrative: "搜索AI化转型+云业务加速。Gemini模型整合进搜索和Workspace生态，Google Cloud增速超30%跻身AI云第一梯队，YouTube广告收入稳健增长。",
    earnings: "Q4营收$965亿，超预期3%。搜索广告增长12%，Google Cloud收入$118亿增长30%首次实现全年盈利，YouTube广告$104亿增长14%。"
  },
  {
    symbol: "AMD", name: "AMD Inc", price: "162.78", change: "-1.45%", up: false, volume: "35.8M",
    pe: "45.6x", pb: "4.2x", marketCap: "$2630亿",
    narrative: "AI芯片市场的第二选择。MI300X GPU在推理市场获得份额，数据中心收入快速增长，但与NVIDIA的差距仍然显著，需要持续证明AI产品竞争力。",
    earnings: "Q4营收$76亿，符合预期。数据中心收入$38亿增长69%，MI300系列贡献超$10亿。客户端和嵌入式业务复苏，但毛利率52%低于NVIDIA。"
  },
];

// ─── News with 4-tier hierarchy + transmission chain + stock impact ───
type NewsTier = "宏观" | "产业" | "行业" | "个股";

interface NewsItem {
  id: number;
  time: string;
  tier: NewsTier;
  title: string;
  source: string;
  sentiment: "positive" | "negative" | "neutral";
  transmissionChain: string[];
  stockImpact: { symbol: string; impact: "positive" | "negative" | "neutral"; note: string }[];
}

const newsItems: NewsItem[] = [
  {
    id: 1, time: "10:32", tier: "宏观",
    title: "美联储会议纪要释放鸽派信号，市场预期6月降息概率升至72%",
    source: "Reuters", sentiment: "positive",
    transmissionChain: ["Fed维持利率不变", "会议纪要措辞偏鸽", "降息预期提前至6月", "美债收益率下行", "成长股估值扩张"],
    stockImpact: [
      { symbol: "NVDA", impact: "positive", note: "利率下行利好高估值成长股" },
      { symbol: "MSFT", impact: "positive", note: "科技股整体受益于宽松预期" },
      { symbol: "JPM", impact: "negative", note: "降息预期压缩银行净息差" },
    ],
  },
  {
    id: 2, time: "09:45", tier: "产业",
    title: "全球AI基础设施投资2026年预计突破$3000亿，同比增长45%",
    source: "Bloomberg", sentiment: "positive",
    transmissionChain: ["企业AI预算大幅增加", "云厂商资本开支上调", "GPU/ASIC需求激增", "AI芯片供应链受益", "算力基础设施扩张"],
    stockImpact: [
      { symbol: "NVDA", impact: "positive", note: "GPU需求直接受益" },
      { symbol: "AVGO", impact: "positive", note: "定制ASIC芯片订单增长" },
      { symbol: "AMZN", impact: "positive", note: "AWS资本开支转化为收入增长" },
    ],
  },
  {
    id: 3, time: "09:12", tier: "宏观",
    title: "中国2月PMI回升至51.2，制造业连续三个月处于扩张区间",
    source: "CNBC", sentiment: "positive",
    transmissionChain: ["中国PMI超预期", "制造业需求回暖", "全球供应链信心提升", "大宗商品需求预期上调", "新兴市场资金流入"],
    stockImpact: [
      { symbol: "AAPL", impact: "positive", note: "大中华区消费复苏利好iPhone销售" },
      { symbol: "XOM", impact: "positive", note: "中国需求回暖支撑油价" },
    ],
  },
  {
    id: 4, time: "08:30", tier: "个股",
    title: "特斯拉Q4交付量49.5万辆不及预期，盘前下跌2.5%",
    source: "WSJ", sentiment: "negative",
    transmissionChain: ["Q4交付不及预期", "市场担忧需求放缓", "竞争对手份额提升", "毛利率压力持续", "短期估值承压"],
    stockImpact: [
      { symbol: "TSLA", impact: "negative", note: "交付量miss直接利空" },
    ],
  },
  {
    id: 5, time: "08:15", tier: "行业",
    title: "GLP-1减肥药市场规模预测上调至$1500亿，礼来/诺和诺德双寡头格局稳固",
    source: "FT", sentiment: "positive",
    transmissionChain: ["肥胖症患者基数庞大", "GLP-1临床数据持续积极", "适应症扩展至心血管/NASH", "市场TAM预测上调", "双寡头定价权增强"],
    stockImpact: [
      { symbol: "LLY", impact: "positive", note: "Mounjaro/Zepbound市场份额领先" },
      { symbol: "UNH", impact: "negative", note: "药品支出增加推高医疗赔付率" },
    ],
  },
  {
    id: 6, time: "07:50", tier: "产业",
    title: "苹果Vision Pro二代曝光，搭载M5芯片，预计2026年Q3发布",
    source: "Bloomberg", sentiment: "positive",
    transmissionChain: ["Vision Pro二代研发推进", "空间计算生态扩展", "开发者应用数量增长", "AR/VR产业链受益", "消费电子创新周期"],
    stockImpact: [
      { symbol: "AAPL", impact: "positive", note: "新品类拓展增长空间" },
      { symbol: "MSFT", impact: "neutral", note: "HoloLens竞争格局变化" },
    ],
  },
  {
    id: 7, time: "07:30", tier: "宏观",
    title: "欧央行暗示4月可能再次降息，欧元兑美元跌破1.08",
    source: "ECB", sentiment: "neutral",
    transmissionChain: ["欧央行释放鸽派信号", "欧元区经济增长乏力", "欧元走弱美元走强", "跨国企业汇兑影响", "美股跨国公司承压"],
    stockImpact: [
      { symbol: "GOOGL", impact: "negative", note: "海外收入占比高，美元走强不利" },
      { symbol: "META", impact: "negative", note: "欧洲广告收入受汇率影响" },
    ],
  },
  {
    id: 8, time: "07:15", tier: "行业",
    title: "全球半导体销售额1月同比增长22%，AI芯片贡献超40%增量",
    source: "SIA", sentiment: "positive",
    transmissionChain: ["半导体行业周期上行", "AI芯片需求爆发", "存储芯片价格企稳", "晶圆代工产能利用率回升", "设备厂商订单增长"],
    stockImpact: [
      { symbol: "NVDA", impact: "positive", note: "AI芯片龙头直接受益" },
      { symbol: "AMD", impact: "positive", note: "数据中心GPU份额提升" },
      { symbol: "AVGO", impact: "positive", note: "网络芯片和ASIC需求增长" },
    ],
  },
  {
    id: 9, time: "06:45", tier: "个股",
    title: "Visa宣布$50亿股票回购计划，季度股息上调12%",
    source: "PR Newswire", sentiment: "positive",
    transmissionChain: ["公司现金流充沛", "管理层对前景有信心", "加大股东回报力度", "EPS增厚效应", "估值支撑"],
    stockImpact: [
      { symbol: "V", impact: "positive", note: "回购+分红直接利好股价" },
    ],
  },
  {
    id: 10, time: "06:30", tier: "宏观",
    title: "原油价格突破$85/桶，OPEC+确认延长减产至Q3，地缘风险溢价上升",
    source: "Reuters", sentiment: "neutral",
    transmissionChain: ["OPEC+延长减产", "地缘政治风险升温", "原油供给收紧", "能源价格上行", "通胀预期小幅回升"],
    stockImpact: [
      { symbol: "XOM", impact: "positive", note: "油价上涨直接利好" },
      { symbol: "TSLA", impact: "positive", note: "高油价推动电动车需求" },
    ],
  },
];

// ─── Sector data ───
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

// ─── Daily Market Analysis Data ───
const sentimentData = [
  { subject: "贪婪指数", value: 68, fullMark: 100 },
  { subject: "看涨期权比", value: 72, fullMark: 100 },
  { subject: "融资余额", value: 65, fullMark: 100 },
  { subject: "新高/新低比", value: 78, fullMark: 100 },
  { subject: "VIX反向", value: 82, fullMark: 100 },
  { subject: "资金流入", value: 58, fullMark: 100 },
];

const dailyAnalysis = {
  date: "2026年2月25日",
  sentiment: {
    score: 68,
    label: "偏乐观",
    summary: "CNN恐惧贪婪指数68（贪婪区间），Put/Call Ratio降至0.82，市场情绪偏暖但尚未过热。融资余额连续三周净流入，北向资金本周累计流入$42亿。VIX维持在14.3低位，隐含波动率处于历史25分位，短期市场风险偏好较高。",
  },
  fundamentals: {
    summary: "标普500成分股中68%已公布Q4财报，其中78%盈利超预期，营收超预期比例72%。整体EPS同比增长12.3%，高于季初预期的8.5%。科技板块盈利增速领跑（+25%），金融板块受益于投行业务回暖（+18%），医疗板块因GLP-1药品成本上升利润率承压。",
    highlights: [
      { label: "盈利超预期比例", value: "78%", trend: "up" },
      { label: "EPS同比增长", value: "+12.3%", trend: "up" },
      { label: "营收超预期比例", value: "72%", trend: "up" },
      { label: "利润率中位数", value: "11.8%", trend: "flat" },
    ],
  },
  technicals: {
    summary: "S&P 500站稳5日/10日/20日均线上方，MACD金叉确认，RSI(14)=62处于中性偏强区间。纳斯达克突破前高阻力位19,400，成交量配合放大。关注5,950支撑位和6,050阻力位，若放量突破6,050则打开上行空间。",
    levels: [
      { label: "S&P 500 支撑位", value: "5,950", type: "support" },
      { label: "S&P 500 阻力位", value: "6,050", type: "resistance" },
      { label: "RSI(14)", value: "62", type: "neutral" },
      { label: "MACD", value: "金叉", type: "bullish" },
    ],
  },
  weeklyForecast: {
    outlook: "谨慎乐观",
    summary: "本周关注周三PCE通胀数据和周五非农就业报告。若PCE核心同比维持在2.6-2.8%区间，将强化6月降息预期，利好风险资产。技术面看多头占优，但需警惕获利回吐压力。建议维持核心仓位，适度参与AI和半导体板块的结构性机会。",
    events: [
      { date: "周三", event: "美国1月PCE物价指数", importance: "high" },
      { date: "周四", event: "初请失业金人数", importance: "medium" },
      { date: "周五", event: "2月非农就业报告", importance: "high" },
      { date: "周五", event: "ISM制造业PMI", importance: "medium" },
    ],
  },
};

// ─── Intraday chart data ───
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

// ─── Animation variants ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ─── Helper components ───
function MiniSparkline({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 60},${30 - ((v - min) / range) * 24}`)
    .join(" ");
  return (
    <svg width="60" height="30" viewBox="0 0 60 30" className="opacity-60">
      <polyline points={points} fill="none" stroke={up ? "#22C55E" : "#EF4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SentimentDot({ sentiment }: { sentiment: string }) {
  const color = sentiment === "positive" ? "bg-profit" : sentiment === "negative" ? "bg-loss" : "bg-muted-foreground";
  return <div className={`w-2 h-2 rounded-full ${color}`} />;
}

const tierColors: Record<NewsTier, string> = {
  "宏观": "border-blue-500/40 text-blue-400 bg-blue-500/10",
  "产业": "border-purple-500/40 text-purple-400 bg-purple-500/10",
  "行业": "border-amber-500/40 text-amber-400 bg-amber-500/10",
  "个股": "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
};

// ─── Stock Detail Modal ───
function StockDetailModal({ stock, onClose }: { stock: StockDetail; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-2xl"
        style={{ borderColor: "rgba(212,168,83,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm" style={{ background: "rgba(212,168,83,0.15)", color: "#D4A853" }}>
            {stock.symbol}
          </div>
          <div className="flex-1">
            <h3 className="font-mono font-bold text-lg text-foreground">{stock.name}</h3>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xl font-mono font-bold text-foreground">${stock.price}</span>
              <span className={`text-sm font-mono font-medium ${stock.up ? "text-profit" : "text-loss"}`}>
                {stock.up ? "↗" : "↘"} {stock.change}
              </span>
            </div>
          </div>
        </div>

        {/* Valuation */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "P/E", value: stock.pe },
            { label: "P/B", value: stock.pb },
            { label: "市值", value: stock.marketCap },
          ].map((item) => (
            <div key={item.label} className="rounded-lg p-3 text-center" style={{ background: "rgba(212,168,83,0.06)", border: "1px solid rgba(212,168,83,0.15)" }}>
              <div className="text-[10px] font-mono text-muted-foreground uppercase">{item.label}</div>
              <div className="text-sm font-mono font-semibold text-gold mt-0.5">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Narrative */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Crosshair className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-mono font-semibold text-gold uppercase">核心叙事</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{stock.narrative}</p>
        </div>

        {/* Earnings */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-mono font-semibold text-gold uppercase">最新财报</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{stock.earnings}</p>
        </div>

        {/* Volume */}
        <div className="mt-4 pt-3 border-t border-gold/10 flex justify-between text-xs font-mono text-muted-foreground">
          <span>成交量: {stock.volume}</span>
          <span>数据仅供参考</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── News Item Component ───
function NewsItemCard({ news, isExpanded, onToggle }: { news: NewsItem; isExpanded: boolean; onToggle: () => void }) {
  return (
    <motion.div
      layout
      className="border-b border-gold/5 last:border-b-0 hover:bg-gold/5 -mx-3 px-3 rounded transition-colors cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex gap-3 py-3">
        <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground">{news.time}</span>
          <SentimentDot sentiment={news.sentiment} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground leading-snug">{news.title}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${tierColors[news.tier]}`}>
              {news.tier}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{news.source}</span>
            {news.stockImpact.map((si) => (
              <span
                key={si.symbol}
                className={`text-[10px] font-mono px-1 py-0.5 rounded ${
                  si.impact === "positive" ? "text-profit bg-profit/10" : si.impact === "negative" ? "text-loss bg-loss/10" : "text-muted-foreground bg-muted/30"
                }`}
              >
                {si.symbol} {si.impact === "positive" ? "↑" : si.impact === "negative" ? "↓" : "—"}
              </span>
            ))}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-8 space-y-3">
              {/* Transmission Chain */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Link2 className="w-3 h-3 text-gold" />
                  <span className="text-[10px] font-mono text-gold uppercase">传导链路</span>
                </div>
                <div className="flex items-center gap-0 flex-wrap">
                  {news.transmissionChain.map((step, i) => (
                    <div key={i} className="flex items-center">
                      <span className="text-[11px] font-mono text-foreground/80 px-2 py-1 rounded" style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.15)" }}>
                        {step}
                      </span>
                      {i < news.transmissionChain.length - 1 && (
                        <span className="text-gold/50 mx-1 text-xs">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Impact */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Target className="w-3 h-3 text-gold" />
                  <span className="text-[10px] font-mono text-gold uppercase">个股影响</span>
                </div>
                <div className="space-y-1">
                  {news.stockImpact.map((si) => (
                    <div key={si.symbol} className="flex items-center gap-2 text-xs">
                      <span className={`font-mono font-semibold w-12 ${
                        si.impact === "positive" ? "text-profit" : si.impact === "negative" ? "text-loss" : "text-muted-foreground"
                      }`}>
                        {si.symbol}
                      </span>
                      <span className={`text-[10px] px-1 rounded ${
                        si.impact === "positive" ? "text-profit bg-profit/10" : si.impact === "negative" ? "text-loss bg-loss/10" : "text-muted-foreground bg-muted/20"
                      }`}>
                        {si.impact === "positive" ? "利好" : si.impact === "negative" ? "利空" : "中性"}
                      </span>
                      <span className="text-muted-foreground">{si.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Home Component ───
export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [selectedStock, setSelectedStock] = useState<StockDetail | null>(null);
  const [expandedNews, setExpandedNews] = useState<number | null>(null);
  const [showAllNews, setShowAllNews] = useState(false);
  const [newsFilter, setNewsFilter] = useState<NewsTier | "全部">("全部");

  const filteredNews = newsFilter === "全部" ? newsItems : newsItems.filter((n) => n.tier === newsFilter);
  const visibleNews = showAllNews ? filteredNews : filteredNews.slice(0, 5);

  return (
    <div className="min-h-screen pt-[66px]">
      {/* Stock Detail Modal */}
      <AnimatePresence>
        {selectedStock && <StockDetailModal stock={selectedStock} onClose={() => setSelectedStock(null)} />}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="relative container py-10 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-5 h-5 text-gold" />
              <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">Market Dashboard</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })} 美东时间
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-gold-gradient mb-2">全球市场概览</h1>
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
              <motion.div key={idx.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 px-5 py-3 border-r border-gold/10 last:border-r-0 min-w-[180px]"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground font-mono truncate">{idx.name}</div>
                  <div className="text-sm font-mono font-semibold text-foreground tabular-nums">{idx.value}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <MiniSparkline data={idx.sparkline} up={idx.up} />
                  <span className={`text-xs font-mono font-medium tabular-nums ${idx.up ? "text-profit" : "text-loss"}`}>{idx.change}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <motion.div className="container py-6" variants={containerVariants} initial="hidden" animate="visible">
        {/* Row 1: Chart + Portfolio Card + Stocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* Intraday Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-7 card-gold rounded-lg bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gold" />
                <h2 className="font-mono font-semibold text-sm text-foreground">S&P 500 日内走势</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono font-bold text-foreground tabular-nums">5,983.25</span>
                <span className="text-sm font-mono text-profit flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />+1.24%
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={intradayData}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A853" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,83,0.08)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#6B7280", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} interval={15} />
                <YAxis tick={{ fontSize: 10, fill: "#6B7280", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,0.95)", border: "1px solid rgba(212,168,83,0.3)", borderRadius: "8px", fontFamily: "JetBrains Mono", fontSize: "12px" }} />
                <Area type="monotone" dataKey="value" stroke="#D4A853" strokeWidth={2} fill="url(#goldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Right column: Portfolio card + Stock list */}
          <div className="lg:col-span-5 space-y-5">
            {/* Portfolio Card */}
            <Link href="/portfolio">
              <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-5 cursor-pointer hover:bg-card/80 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-gold" />
                    <h2 className="font-mono font-semibold text-sm text-foreground">旗舰组合</h2>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-bold text-profit">+32.8%</span>
                  <span className="text-xs text-muted-foreground font-mono">年化收益</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-profit/15 text-profit border border-profit/25">超额 +12.4%</span>
                  <span className="text-xs text-muted-foreground font-mono">vs S&P 500</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">查看完整组合表现、持仓明细与行业分布 →</p>
              </motion.div>
            </Link>

            {/* Stock List - Clickable */}
            <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gold" />
                  <h2 className="font-mono font-semibold text-sm text-foreground">热门个股</h2>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">点击查看详情</span>
              </div>
              <div className="space-y-0">
                {topStocks.map((stock, i) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 py-2 border-b border-gold/5 last:border-b-0 hover:bg-gold/5 -mx-2 px-2 rounded transition-colors cursor-pointer"
                    onClick={() => setSelectedStock(stock)}
                  >
                    <span className="text-xs font-mono font-bold text-gold w-12">{stock.symbol}</span>
                    <span className="text-xs text-muted-foreground flex-1 truncate">{stock.name}</span>
                    <span className="text-xs font-mono text-foreground tabular-nums">${stock.price}</span>
                    <span className={`text-xs font-mono tabular-nums w-16 text-right ${stock.up ? "text-profit" : "text-loss"}`}>
                      {stock.up ? "↗" : "↘"} {stock.change}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Row 2: News (wider) + Sector + Market Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* News Feed - 8 cols */}
          <motion.div variants={itemVariants} className="lg:col-span-8 card-gold rounded-lg bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="w-4 h-4 text-gold" />
              <h2 className="font-mono font-semibold text-sm text-foreground">实时新闻</h2>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-profit data-pulse" />
                <span className="text-[10px] font-mono text-muted-foreground">LIVE</span>
              </div>
            </div>

            {/* Tier filters */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Filter className="w-3 h-3 text-muted-foreground" />
              {(["全部", "宏观", "产业", "行业", "个股"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setNewsFilter(tier)}
                  className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${
                    newsFilter === tier
                      ? "border-gold/50 text-gold bg-gold/10"
                      : "border-gold/10 text-muted-foreground hover:text-foreground hover:border-gold/30"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            <div className="space-y-0">
              {visibleNews.map((news) => (
                <NewsItemCard
                  key={news.id}
                  news={news}
                  isExpanded={expandedNews === news.id}
                  onToggle={() => setExpandedNews(expandedNews === news.id ? null : news.id)}
                />
              ))}
            </div>

            {filteredNews.length > 5 && (
              <button
                onClick={() => setShowAllNews(!showAllNews)}
                className="w-full mt-3 py-2 text-xs font-mono text-gold/70 hover:text-gold border border-gold/10 hover:border-gold/30 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                {showAllNews ? (
                  <>收起 <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>展开更多 ({filteredNews.length - 5}条) <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            )}
          </motion.div>

          {/* Right sidebar: Sector + Market Stats */}
          <div className="lg:col-span-4 space-y-5">
            {/* Sector Performance */}
            <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-gold" />
                <h2 className="font-mono font-semibold text-sm text-foreground">板块表现</h2>
              </div>
              <div className="space-y-2">
                {sectorData.map((sector) => (
                  <div key={sector.name} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-8">{sector.name}</span>
                    <div className="flex-1 h-4 bg-secondary/50 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.abs(sector.value) * 20}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full rounded-full ${sector.value >= 0 ? "bg-profit/60" : "bg-loss/60"}`}
                        style={{ marginLeft: sector.value < 0 ? "auto" : undefined }}
                      />
                    </div>
                    <span className={`text-xs font-mono tabular-nums w-12 text-right ${sector.value >= 0 ? "text-profit" : "text-loss"}`}>
                      {sector.value >= 0 ? "+" : ""}{sector.value}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Market Stats */}
            <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-gold" />
                <h2 className="font-mono font-semibold text-sm text-foreground">市场情绪</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-mono">VIX 恐慌指数</span>
                  <span className="text-sm font-mono text-profit tabular-nums">14.32</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "28%", background: "linear-gradient(90deg, #22C55E, #D4A853)" }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>低波动</span><span>高波动</span>
                </div>
                <div className="border-t border-gold/10 pt-3 mt-3 space-y-2">
                  {[
                    { label: "10Y 美债收益率", value: "4.28%", color: "" },
                    { label: "美元指数 DXY", value: "104.52", color: "" },
                    { label: "黄金 XAU/USD", value: "$2,935.40", color: "text-gold" },
                    { label: "原油 WTI", value: "$78.45", color: "" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-xs text-muted-foreground font-mono">{item.label}</span>
                      <span className={`text-sm font-mono tabular-nums ${item.color || "text-foreground"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Row 3: Daily Market Analysis */}
        <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-6 mb-5">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-5 h-5 text-gold" />
            <h2 className="font-mono font-bold text-base text-foreground">每日市场解析</h2>
            <span className="text-xs font-mono text-muted-foreground ml-auto">{dailyAnalysis.date}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment */}
            <div className="rounded-lg p-4" style={{ background: "rgba(212,168,83,0.04)", border: "1px solid rgba(212,168,83,0.12)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-gold" />
                <h3 className="font-mono font-semibold text-sm text-gold">情绪面</h3>
                <span className={`ml-auto text-xs font-mono px-2 py-0.5 rounded ${
                  dailyAnalysis.sentiment.score >= 60 ? "bg-profit/15 text-profit border border-profit/25" : "bg-loss/15 text-loss border border-loss/25"
                }`}>
                  {dailyAnalysis.sentiment.label} ({dailyAnalysis.sentiment.score}/100)
                </span>
              </div>
              <div className="mb-4">
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={sentimentData}>
                    <PolarGrid stroke="rgba(212,168,83,0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "JetBrains Mono" }} />
                    <Radar name="情绪" dataKey="value" stroke="#D4A853" fill="#D4A853" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{dailyAnalysis.sentiment.summary}</p>
            </div>

            {/* Fundamentals */}
            <div className="rounded-lg p-4" style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)" }}>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-profit" />
                <h3 className="font-mono font-semibold text-sm text-profit">基本面</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {dailyAnalysis.fundamentals.highlights.map((h) => (
                  <div key={h.label} className="rounded-md p-2.5 text-center" style={{ background: "rgba(34,197,94,0.06)" }}>
                    <div className="text-[10px] font-mono text-muted-foreground">{h.label}</div>
                    <div className={`text-sm font-mono font-bold mt-0.5 ${h.trend === "up" ? "text-profit" : h.trend === "down" ? "text-loss" : "text-foreground"}`}>
                      {h.value}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{dailyAnalysis.fundamentals.summary}</p>
            </div>

            {/* Technicals */}
            <div className="rounded-lg p-4" style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.12)" }}>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <h3 className="font-mono font-semibold text-sm text-blue-400">技术面</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {dailyAnalysis.technicals.levels.map((l) => (
                  <div key={l.label} className="flex items-center justify-between rounded-md px-2.5 py-2" style={{ background: "rgba(59,130,246,0.06)" }}>
                    <span className="text-[10px] font-mono text-muted-foreground">{l.label}</span>
                    <span className={`text-xs font-mono font-semibold ${
                      l.type === "bullish" ? "text-profit" : l.type === "support" ? "text-blue-400" : l.type === "resistance" ? "text-amber-400" : "text-foreground"
                    }`}>
                      {l.value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{dailyAnalysis.technicals.summary}</p>
            </div>

            {/* Weekly Forecast */}
            <div className="rounded-lg p-4" style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.12)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-purple-400" />
                <h3 className="font-mono font-semibold text-sm text-purple-400">本周预测</h3>
                <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/25">
                  {dailyAnalysis.weeklyForecast.outlook}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {dailyAnalysis.weeklyForecast.events.map((e) => (
                  <div key={e.event} className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-muted-foreground w-8">{e.date}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${e.importance === "high" ? "bg-loss" : "bg-amber-400"}`} />
                    <span className="text-foreground/80 font-mono">{e.event}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{dailyAnalysis.weeklyForecast.summary}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="border-t border-gold/10 mt-4">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-muted-foreground">&copy; 2025 UC Capital. All rights reserved.</span>
          <span className="text-[10px] font-mono text-muted-foreground">数据仅供参考，不构成投资建议</span>
        </div>
      </footer>
    </div>
  );
}
