/**
 * Portfolio Page - Flagship Portfolio
 * Bloomberg Terminal Neo Style
 * SPY/QQQ comparison curves, excess return badges, holdings table with expandable details, sector pie chart
 */
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Target,
  Shield,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  Crosshair,
  BookOpen,
  Lock,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PORTFOLIO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/YaP317eOKyuIkprNnugzm7/sandbox/Ac3WClDop2IEMcCR2v0NAv-img-2_1771981306000_na1fn_cG9ydGZvbGlvLWJn.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWWFQMzE3ZU9LeXVJa3ByTm51Z3ptNy9zYW5kYm94L0FjM1dDbERvcDJJRU1jQ1IydjBOQXYtaW1nLTJfMTc3MTk4MTMwNjAwMF9uYTFmbl9jRzl5ZEdadmJHbHZMV0puLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=TVksId7DdNj9QP7I~6pst61Ud-Wrm0NW0PXKFs56QfQxk0VD3cw74qvmO5QnS~8jsxsSO2Q3eY~uc5WKFW-XJ4R5pqK5JVxCi2r8UxZsb7fsDN5Xhs0eKgjiR0fjtY0nCGGndBOxflR3nENK-Oq6eUrMcDSf6HVR7bf9kcumEDy8wG-8cMGU0GlNAB6wqVdxyNhg1kP77aBihwWTAmEkcorhYSeYcwuxpy32c72ax-G5P0ywnbDUcG~X0h0Q6~BYdm2VQRqWaKeYaTBrrcKKmc8wTTBAvbL02~~TXYtZazxx23HmcN5vK0jMbN9Tt21pEJ2W-hc-b1jDM9107UZv7A__";

// Generate performance data (12 months)
const months = ["2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02"];

const performanceData = months.map((month, i) => {
  const ucBase = 100;
  const spyBase = 100;
  const qqqBase = 100;
  const ucReturn = ucBase * (1 + (0.028 + Math.sin(i * 0.5) * 0.01) * (i + 1));
  const spyReturn = spyBase * (1 + (0.017 + Math.sin(i * 0.7) * 0.008) * (i + 1));
  const qqqReturn = qqqBase * (1 + (0.02 + Math.sin(i * 0.6) * 0.012) * (i + 1));
  return {
    month: month.slice(5),
    "UC Capital": Math.round(ucReturn * 10) / 10,
    "SPY": Math.round(spyReturn * 10) / 10,
    "QQQ": Math.round(qqqReturn * 10) / 10,
  };
});

interface Holding {
  symbol: string;
  name: string;
  weight: string;
  avgCost: string;
  current: string;
  return: string;
  up: boolean;
  sector: string;
  // New fields
  pe: string;
  pb: string;
  marketCap: string;
  narrative: string;
  earnings: string;
}

const holdings: Holding[] = [
  {
    symbol: "NVDA", name: "NVIDIA Corporation", weight: "12.5%", avgCost: "$98.50", current: "$138.25", return: "+40.4%", up: true, sector: "科技",
    pe: "55.2x", pb: "42.8x", marketCap: "$3.4T",
    narrative: "AI算力基础设施的绝对垄断者。Blackwell架构GPU供不应求，数据中心收入同比增长150%+，云厂商资本开支持续加码确保未来2-3年需求可见性极高。",
    earnings: "FY25Q4营收$393亿，超预期8%。数据中心收入$356亿创新高，毛利率74.5%。管理层上调下季指引至$430亿，Blackwell产能爬坡顺利。"
  },
  {
    symbol: "AAPL", name: "Apple Inc", weight: "10.2%", avgCost: "$198.30", current: "$245.12", return: "+23.6%", up: true, sector: "科技",
    pe: "32.8x", pb: "52.1x", marketCap: "$3.7T",
    narrative: "全球最强消费科技生态。iPhone 16系列搭载Apple Intelligence推动换机潮，服务业务收入占比持续提升至25%+，高毛利率改善整体盈利质量。",
    earnings: "FY25Q1营收$1243亿，同比+4%。iPhone收入$693亿略超预期，服务业务$268亿创历史新高，大中华区恢复增长+11%。"
  },
  {
    symbol: "MSFT", name: "Microsoft Corp", weight: "9.8%", avgCost: "$365.00", current: "$425.89", return: "+16.7%", up: true, sector: "科技",
    pe: "35.6x", pb: "12.3x", marketCap: "$3.2T",
    narrative: "企业AI转型的最大受益者。Azure云增速重新加速至30%+，Copilot商业化进入收获期，Office 365渗透率持续提升，企业级AI护城河深厚。",
    earnings: "FY25Q2营收$696亿，超预期3%。Azure增长31%（含AI贡献13pct），Copilot付费用户突破200万，智能云毛利率提升至72%。"
  },
  {
    symbol: "AMZN", name: "Amazon.com Inc", weight: "8.5%", avgCost: "$155.20", current: "$198.34", return: "+27.8%", up: true, sector: "消费",
    pe: "42.5x", pb: "8.7x", marketCap: "$2.1T",
    narrative: "AWS云计算+电商双轮驱动。AWS受益于企业AI工作负载迁移，增速重回20%+；北美电商利润率持续改善，广告业务成为第三增长极。",
    earnings: "Q4营收$1878亿，超预期2%。AWS收入$289亿增长19%，运营利润率创新高达11.2%，广告业务增长27%至$173亿。"
  },
  {
    symbol: "META", name: "Meta Platforms", weight: "7.8%", avgCost: "$480.00", current: "$612.45", return: "+27.6%", up: true, sector: "科技",
    pe: "25.3x", pb: "8.2x", marketCap: "$1.6T",
    narrative: "社交广告AI化的领跑者。Advantage+智能广告系统大幅提升ROI，Reels变现效率追平Stories，Llama开源模型构建AI生态，用户时长持续增长。",
    earnings: "Q4营收$484亿，超预期4%。广告收入增长21%，Reels年化营收超$100亿，DAP达33.5亿人。2026年资本开支指引$60-65B用于AI基础设施。"
  },
  {
    symbol: "GOOGL", name: "Alphabet Inc", weight: "7.2%", avgCost: "$142.50", current: "$178.90", return: "+25.5%", up: true, sector: "科技",
    pe: "22.8x", pb: "7.1x", marketCap: "$2.2T",
    narrative: "搜索AI化转型+云业务加速。Gemini模型整合进搜索和Workspace生态，Google Cloud增速超30%跻身AI云第一梯队，YouTube广告收入稳健增长。",
    earnings: "Q4营收$965亿，超预期3%。搜索广告增长12%，Google Cloud收入$118亿增长30%首次实现全年盈利，YouTube广告$104亿增长14%。"
  },
  {
    symbol: "LLY", name: "Eli Lilly & Co", weight: "6.5%", avgCost: "$720.00", current: "$835.60", return: "+16.1%", up: true, sector: "医疗",
    pe: "68.5x", pb: "45.2x", marketCap: "$7980亿",
    narrative: "GLP-1减肥药赛道的双寡头之一。Mounjaro/Zepbound供不应求，产能扩张持续推进，肥胖症市场TAM超$1000亿，管线中阿尔茨海默药物提供额外期权价值。",
    earnings: "Q4营收$138亿，同比+45%。Mounjaro收入$48亿，Zepbound收入$16亿超预期，2026年全年指引$58-61B暗示增长32%。产能瓶颈逐步缓解。"
  },
  {
    symbol: "AVGO", name: "Broadcom Inc", weight: "5.8%", avgCost: "$145.00", current: "$198.50", return: "+36.9%", up: true, sector: "科技",
    pe: "38.2x", pb: "11.5x", marketCap: "$9200亿",
    narrative: "定制AI芯片（ASIC）的隐形冠军。为Google TPU、Meta MTIA等提供定制芯片设计，VMware整合带来企业软件协同效应，AI网络交换芯片市占率领先。",
    earnings: "FY25Q1营收$149亿，超预期5%。AI收入$41亿增长77%，基础设施软件$66亿（含VMware），管理层预计AI可寻址市场2027年达$600-900亿。"
  },
  {
    symbol: "JPM", name: "JPMorgan Chase", weight: "5.2%", avgCost: "$185.00", current: "$232.45", return: "+25.6%", up: true, sector: "金融",
    pe: "12.1x", pb: "2.0x", marketCap: "$6850亿",
    narrative: "美国最大银行，经济软着陆的核心受益者。净息差稳定在2.7%+，投行业务回暖，资产管理规模创新高，信贷质量保持健康，分红+回购回报股东。",
    earnings: "Q4营收$437亿，超预期6%。净利润$140亿创季度新高，投行手续费增长49%，信用卡贷款增长12%，净冲销率维持在2.6%可控水平。"
  },
  {
    symbol: "V", name: "Visa Inc", weight: "4.8%", avgCost: "$268.00", current: "$312.30", return: "+16.5%", up: true, sector: "金融",
    pe: "30.5x", pb: "14.8x", marketCap: "$5750亿",
    narrative: "全球支付网络双寡头，数字支付长期渗透率提升的确定性受益者。跨境交易恢复强劲增长，新兴市场数字化转型带来增量，轻资产模式下自由现金流充沛。",
    earnings: "FY25Q1营收$99亿，同比+10%。支付交易量增长9%，跨境交易量增长16%，运营利润率67%保持行业领先，回购$38亿股票。"
  },
  {
    symbol: "UNH", name: "UnitedHealth", weight: "4.5%", avgCost: "$520.00", current: "$485.20", return: "-6.7%", up: false, sector: "医疗",
    pe: "18.2x", pb: "5.8x", marketCap: "$4450亿",
    narrative: "美国最大健康险+医疗服务一体化平台。Optum健康服务业务持续整合扩张，Medicare Advantage会员数领先，但短期面临医疗成本上升和监管审查压力。",
    earnings: "Q4营收$1008亿，略低于预期。医疗赔付率87.3%环比上升1.2pct，Optum收入$654亿增长12%但利润率承压。管理层下调2026年EPS指引至$26-26.5。"
  },
  {
    symbol: "XOM", name: "Exxon Mobil", weight: "3.8%", avgCost: "$105.00", current: "$112.80", return: "+7.4%", up: true, sector: "能源",
    pe: "14.5x", pb: "2.1x", marketCap: "$4850亿",
    narrative: "全球最大综合能源公司，Pioneer收购后Permian产量跃升至行业第一。低成本油气资产组合提供下行保护，高股息+回购策略对股东友好，能源转型中的压舱石。",
    earnings: "Q4营收$877亿，符合预期。上游产量达390万桶/日创新高，Permian贡献220万桶。全年自由现金流$360亿，分红+回购$360亿，净债务率降至5%。"
  },
  {
    symbol: "CASH", name: "现金及等价物", weight: "13.4%", avgCost: "-", current: "-", return: "-", up: true, sector: "现金",
    pe: "-", pb: "-", marketCap: "-",
    narrative: "保持适度现金仓位作为战术储备，用于市场回调时的逢低加仓机会，同时提供组合流动性缓冲。",
    earnings: "当前配置于短期美国国债和货币市场基金，年化收益约5.2%，在高利率环境下提供无风险收益。"
  },
];

const sectorAllocation = [
  { name: "科技", value: 53.3, color: "#D4A853" },
  { name: "医疗", value: 11.0, color: "#22C55E" },
  { name: "金融", value: 10.0, color: "#3B82F6" },
  { name: "消费", value: 8.5, color: "#8B5CF6" },
  { name: "能源", value: 3.8, color: "#F59E0B" },
  { name: "现金", value: 13.4, color: "#6B7280" },
];

const kpiCards = [
  { label: "年化收益率", value: "+32.8%", sub: "过去12个月", icon: TrendingUp, color: "text-profit" },
  { label: "超额收益", value: "+12.4%", sub: "vs S&P 500", icon: Award, color: "text-gold" },
  { label: "夏普比率", value: "2.15", sub: "风险调整后", icon: Target, color: "text-foreground" },
  { label: "最大回撤", value: "-8.2%", sub: "过去12个月", icon: Shield, color: "text-loss" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg p-3 border" style={{ background: "rgba(17, 24, 39, 0.95)", borderColor: "rgba(212,168,83,0.3)" }}>
      <p className="text-xs font-mono text-muted-foreground mb-2">{label}月</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs font-mono">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="text-foreground tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const CustomPieLabel = ({ cx, cy, midAngle, outerRadius, name, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (value < 5) return null;
  return (
    <text x={x} y={y} fill="#9ca3af" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11} fontFamily="JetBrains Mono">
      {name} {value}%
    </text>
  );
};

// Pro gate overlay for holdings detail
function ProGateOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg"
      style={{ backdropFilter: "blur(6px)", background: "rgba(10,14,23,0.55)" }}
    >
      <div className="flex flex-col items-center gap-3 px-6 py-5 rounded-xl border text-center"
        style={{ background: "rgba(10,14,23,0.85)", borderColor: "rgba(212,168,83,0.35)" }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(212,168,83,0.12)" }}>
          <Lock className="w-5 h-5 text-gold" />
        </div>
        <div>
          <p className="text-sm font-mono font-semibold text-foreground mb-1">Pro 专属内容</p>
          <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
            升级 Pro 解锁持仓估值、核心叙事与财报深度解读
          </p>
        </div>
        <Link href="/pricing">
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, #D4A853, #B8882A)", color: "#0A0E17" }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            升级 Pro
          </button>
        </Link>
      </div>
    </div>
  );
}

function HoldingRow({ h, index }: { h: Holding; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isCash = h.symbol === "CASH";
  // First 2 holdings are visible as preview; rest are Pro-gated
  const isPro = index >= 2;

  return (
    <>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + index * 0.04 }}
        className={`border-b border-gold/5 transition-colors ${!isCash ? "hover:bg-gold/5 cursor-pointer" : ""} ${expanded ? "bg-gold/5" : ""}`}
        onClick={() => !isCash && setExpanded(!expanded)}
      >
        <td className="py-2.5 px-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-semibold text-sm text-gold">{h.symbol}</span>
            {!isCash && (
              expanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        </td>
        <td className="py-2.5 px-2 text-sm text-muted-foreground hidden md:table-cell">{h.name}</td>
        <td className="py-2.5 px-2 text-right font-mono text-sm tabular-nums text-foreground">{h.weight}</td>
        <td className="py-2.5 px-2 text-right font-mono text-sm tabular-nums text-muted-foreground hidden sm:table-cell">{h.avgCost}</td>
        <td className="py-2.5 px-2 text-right font-mono text-sm tabular-nums text-foreground hidden sm:table-cell">{h.current}</td>
        <td className="py-2.5 px-2 text-right">
          {h.return === "-" ? (
            <span className="font-mono text-sm text-muted-foreground">-</span>
          ) : (
            <span className={`inline-flex items-center gap-0.5 font-mono text-sm tabular-nums ${h.up ? "text-profit" : "text-loss"}`}>
              {h.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {h.return}
            </span>
          )}
        </td>
      </motion.tr>
      <AnimatePresence>
        {expanded && !isCash && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <td colSpan={6} className="p-0">
              <div className="relative px-4 py-4 bg-gold/[0.03] border-b border-gold/10 overflow-hidden">
                {/* Pro gate overlay */}
                {isPro && <ProGateOverlay />}
                <div className={isPro ? "select-none" : ""}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Valuation */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Crosshair className="w-3.5 h-3.5 text-gold" />
                        <span className="text-xs font-mono text-gold uppercase tracking-wider">估值水平</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-card/80 rounded px-2.5 py-2 border border-gold/10">
                          <div className="text-[10px] font-mono text-muted-foreground">P/E</div>
                          <div className="text-sm font-mono font-semibold text-foreground tabular-nums">{h.pe}</div>
                        </div>
                        <div className="bg-card/80 rounded px-2.5 py-2 border border-gold/10">
                          <div className="text-[10px] font-mono text-muted-foreground">P/B</div>
                          <div className="text-sm font-mono font-semibold text-foreground tabular-nums">{h.pb}</div>
                        </div>
                        <div className="bg-card/80 rounded px-2.5 py-2 border border-gold/10">
                          <div className="text-[10px] font-mono text-muted-foreground">市值</div>
                          <div className="text-sm font-mono font-semibold text-foreground tabular-nums">{h.marketCap}</div>
                        </div>
                      </div>
                    </div>
                    {/* Narrative */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Target className="w-3.5 h-3.5 text-gold" />
                        <span className="text-xs font-mono text-gold uppercase tracking-wider">核心叙事</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{h.narrative}</p>
                    </div>
                    {/* Earnings */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <FileText className="w-3.5 h-3.5 text-gold" />
                        <span className="text-xs font-mono text-gold uppercase tracking-wider">财报解读</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{h.earnings}</p>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Portfolio() {
  return (
    <div className="min-h-screen pt-[66px]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${PORTFOLIO_BG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        <div className="relative container py-10 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-5 h-5 text-gold" />
              <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">Flagship Portfolio</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">2025.03 - 2026.02</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-gold-gradient mb-2">旗舰投资组合</h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              UC Capital 核心策略组合，聚焦AI与科技赛道，通过量化模型动态调仓，追求长期超额收益。点击个股行可展开查看估值、叙事与财报详情。
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div className="container py-6" variants={containerVariants} initial="hidden" animate="visible">
        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiCards.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-gold rounded-lg bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-gold" />
                  <span className="text-xs font-mono text-muted-foreground">{kpi.label}</span>
                </div>
                <div className={`text-2xl font-mono font-bold tabular-nums ${kpi.color}`}>{kpi.value}</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1">{kpi.sub}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Performance Chart */}
        <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-5 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold" />
              <h2 className="font-mono font-semibold text-sm text-foreground">收益对比曲线</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-gold" /><span className="text-[10px] font-mono text-muted-foreground">UC Capital</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-blue-500" /><span className="text-[10px] font-mono text-muted-foreground">SPY</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-purple-500" /><span className="text-[10px] font-mono text-muted-foreground">QQQ</span></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-profit/15 text-profit border border-profit/20">vs SPY 超额 +12.4%</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-gold/15 text-gold border border-gold/20">vs QQQ 超额 +8.6%</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/20">信息比率 1.85</span>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,83,0.08)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "rgba(212,168,83,0.15)" }} tickLine={false} tickFormatter={(v) => `${v}月`} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={45} domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="UC Capital" stroke="#D4A853" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "#D4A853", stroke: "#0A0E17", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="SPY" stroke="#3B82F6" strokeWidth={1.5} dot={false} strokeDasharray="4 4" activeDot={{ r: 3, fill: "#3B82F6" }} />
                <Line type="monotone" dataKey="QQQ" stroke="#8B5CF6" strokeWidth={1.5} dot={false} strokeDasharray="4 4" activeDot={{ r: 3, fill: "#8B5CF6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Holdings + Sector Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Holdings Table with Expandable Details */}
          <motion.div variants={itemVariants} className="lg:col-span-2 card-gold rounded-lg bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gold" />
                <h2 className="font-mono font-semibold text-sm text-foreground">持仓明细</h2>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-mono">点击行展开详情</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10">
                    <th className="text-left py-2 px-2 text-xs font-mono text-muted-foreground font-medium">代码</th>
                    <th className="text-left py-2 px-2 text-xs font-mono text-muted-foreground font-medium hidden md:table-cell">名称</th>
                    <th className="text-right py-2 px-2 text-xs font-mono text-muted-foreground font-medium">权重</th>
                    <th className="text-right py-2 px-2 text-xs font-mono text-muted-foreground font-medium hidden sm:table-cell">成本价</th>
                    <th className="text-right py-2 px-2 text-xs font-mono text-muted-foreground font-medium hidden sm:table-cell">现价</th>
                    <th className="text-right py-2 px-2 text-xs font-mono text-muted-foreground font-medium">收益率</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, i) => (
                    <HoldingRow key={h.symbol} h={h} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Sector Distribution */}
          <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="w-4 h-4 text-gold" />
              <h2 className="font-mono font-semibold text-sm text-foreground">行业分布</h2>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sectorAllocation} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value" label={CustomPieLabel} labelLine={false}>
                    {sectorAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "rgba(17, 24, 39, 0.95)", border: "1px solid rgba(212,168,83,0.3)", borderRadius: "6px", fontFamily: "JetBrains Mono", fontSize: "12px", color: "#e5e7eb" }} formatter={(value: number) => [`${value}%`, "占比"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {sectorAllocation.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                  <span className="text-xs font-mono text-muted-foreground">{s.name}</span>
                  <span className="text-xs font-mono text-foreground ml-auto tabular-nums">{s.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Strategy Description */}
        <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-gold" />
            <h2 className="font-mono font-semibold text-sm text-foreground">策略说明</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xs font-mono text-gold mb-2 uppercase tracking-wider">投资理念</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">聚焦AI革命与科技创新的长期趋势，通过深度基本面研究结合量化信号，精选具备护城河的优质公司，追求风险调整后的超额收益。</p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-gold mb-2 uppercase tracking-wider">调仓策略</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">采用动态权重管理，根据市场环境和个股估值水平进行月度再平衡。设置严格的止损纪律，单一持仓不超过15%，保持适度的现金缓冲。</p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-gold mb-2 uppercase tracking-wider">风险控制</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">通过行业分散、个股限仓和尾部风险对冲等多维度风控措施，将最大回撤控制在10%以内，夏普比率目标维持在2.0以上。</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center py-4">
          <p className="text-[10px] font-mono text-muted-foreground/60">以上数据为模拟回测结果，不代表实际投资收益。过往业绩不预示未来表现，投资有风险，入市需谨慎。</p>
        </motion.div>
      </motion.div>

      <footer className="border-t border-gold/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-muted-foreground">&copy; 2025 UC Capital. All rights reserved.</span>
          <span className="text-[10px] font-mono text-muted-foreground">数据仅供参考，不构成投资建议</span>
        </div>
      </footer>
    </div>
  );
}
