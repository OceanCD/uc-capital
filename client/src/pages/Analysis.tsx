/**
 * Analysis Page - Portfolio Analysis Report (Pro Feature Demo)
 * Bloomberg Terminal Neo Style
 * Upload/input holdings interface + sample report preview + Pro badge
 */
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Crown,
  Lock,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Shield,
  BarChart3,
  Target,
  ArrowRight,
  X,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { toast } from "sonner";

interface MockHolding {
  symbol: string;
  shares: string;
  cost: string;
}

const defaultHoldings: MockHolding[] = [
  { symbol: "AAPL", shares: "100", cost: "185.00" },
  { symbol: "MSFT", shares: "50", cost: "380.00" },
  { symbol: "NVDA", shares: "80", cost: "110.00" },
  { symbol: "GOOGL", shares: "60", cost: "145.00" },
  { symbol: "AMZN", shares: "40", cost: "160.00" },
];

// Sample report data
const sampleSectorData = [
  { name: "科技", value: 72, color: "#D4A853" },
  { name: "消费", value: 12, color: "#8B5CF6" },
  { name: "金融", value: 8, color: "#3B82F6" },
  { name: "医疗", value: 5, color: "#22C55E" },
  { name: "其他", value: 3, color: "#6B7280" },
];

const sampleRiskData = [
  { subject: "集中度风险", A: 85 },
  { subject: "波动率", A: 62 },
  { subject: "相关性", A: 78 },
  { subject: "流动性", A: 25 },
  { subject: "估值风险", A: 55 },
  { subject: "下行风险", A: 45 },
];

const sampleBenchmarkData = [
  { name: "1月", portfolio: 3.2, spy: 2.1 },
  { name: "3月", portfolio: 8.5, spy: 5.8 },
  { name: "6月", portfolio: 15.2, spy: 10.4 },
  { name: "YTD", portfolio: 22.8, spy: 14.6 },
  { name: "1年", portfolio: 35.4, spy: 20.3 },
];

const riskItems = [
  { level: "high", icon: AlertTriangle, text: "行业集中度过高：科技板块占比72%，建议降至50%以下", color: "text-loss" },
  { level: "medium", icon: AlertTriangle, text: "前5大持仓占比超过80%，个股集中风险较高", color: "text-yellow-500" },
  { level: "low", icon: CheckCircle, text: "组合Beta系数1.15，整体风险可控", color: "text-profit" },
  { level: "low", icon: CheckCircle, text: "流动性良好，所有持仓日均成交额超$1亿", color: "text-profit" },
];

const suggestions = [
  { icon: Shield, title: "分散行业配置", desc: "建议增配金融（JPM/V）、医疗（LLY/UNH）板块，降低科技集中度至50%以下。" },
  { icon: TrendingUp, title: "优化收益来源", desc: "当前组合过度依赖成长因子，建议配置10-15%价值型标的以平衡风格暴露。" },
  { icon: Target, title: "设置止损纪律", desc: "建议对单一持仓设置-15%止损线，组合层面设置-10%最大回撤预警。" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Analysis() {
  const [holdings, setHoldings] = useState<MockHolding[]>(defaultHoldings);
  const [showReport, setShowReport] = useState(false);

  const addRow = () => {
    setHoldings([...holdings, { symbol: "", shares: "", cost: "" }]);
  };

  const removeRow = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof MockHolding, value: string) => {
    const updated = [...holdings];
    updated[index] = { ...updated[index], [field]: value };
    setHoldings(updated);
  };

  const handleGenerate = () => {
    setShowReport(true);
    toast("示例报告已生成", { description: "这是一份 Demo 报告，Pro 版本将提供完整的深度分析。" });
  };

  return (
    <div className="min-h-screen pt-[66px]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] via-background to-background" />
        <div className="relative container py-10 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-gold" />
              <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">Portfolio Analysis</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/25 flex items-center gap-1 ml-2">
                <Crown className="w-3 h-3" />
                Pro
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-gold-gradient mb-2">投资组合分析报告</h1>
            <p className="text-muted-foreground text-sm max-w-2xl">
              输入您的投资持仓，一键生成专业级组合分析报告。涵盖风险评估、行业分布、收益对比、优化建议等多维度深度分析。
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div className="container py-6" variants={containerVariants} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Input Panel */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="card-gold rounded-lg bg-card p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-gold" />
                  <h2 className="font-mono font-semibold text-sm text-foreground">输入持仓</h2>
                </div>
                <button
                  className="text-[10px] font-mono text-gold/70 hover:text-gold px-2 py-1 rounded border border-gold/15 hover:border-gold/30 transition-colors"
                  onClick={() => toast("CSV 导入功能即将上线", { description: "Pro 版本支持从券商导出文件直接导入。" })}
                >
                  <span className="flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    导入 CSV
                    <Lock className="w-2.5 h-2.5 opacity-50" />
                  </span>
                </button>
              </div>

              {/* Holdings Input */}
              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-muted-foreground px-1">
                  <div className="col-span-4">股票代码</div>
                  <div className="col-span-3">持仓数量</div>
                  <div className="col-span-4">成本价($)</div>
                  <div className="col-span-1"></div>
                </div>
                {holdings.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-12 gap-2"
                  >
                    <input
                      className="col-span-4 bg-secondary/50 border border-gold/10 rounded px-2.5 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-gold/40 focus:outline-none transition-colors"
                      value={h.symbol}
                      onChange={(e) => updateRow(i, "symbol", e.target.value.toUpperCase())}
                      placeholder="AAPL"
                    />
                    <input
                      className="col-span-3 bg-secondary/50 border border-gold/10 rounded px-2.5 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-gold/40 focus:outline-none transition-colors tabular-nums"
                      value={h.shares}
                      onChange={(e) => updateRow(i, "shares", e.target.value)}
                      placeholder="100"
                    />
                    <input
                      className="col-span-4 bg-secondary/50 border border-gold/10 rounded px-2.5 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-gold/40 focus:outline-none transition-colors tabular-nums"
                      value={h.cost}
                      onChange={(e) => updateRow(i, "cost", e.target.value)}
                      placeholder="185.00"
                    />
                    <button
                      className="col-span-1 flex items-center justify-center text-muted-foreground hover:text-loss transition-colors"
                      onClick={() => removeRow(i)}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={addRow}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded border border-dashed border-gold/20 text-xs font-mono text-muted-foreground hover:text-gold hover:border-gold/40 transition-colors mb-4"
              >
                <Plus className="w-3.5 h-3.5" />
                添加持仓
              </button>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-mono text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, rgba(212,168,83,0.2), rgba(212,168,83,0.1))",
                  border: "1px solid rgba(212,168,83,0.4)",
                  color: "#D4A853",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(212,168,83,0.3), rgba(212,168,83,0.15))";
                  e.currentTarget.style.borderColor = "rgba(212,168,83,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(212,168,83,0.2), rgba(212,168,83,0.1))";
                  e.currentTarget.style.borderColor = "rgba(212,168,83,0.4)";
                }}
              >
                <Sparkles className="w-4 h-4" />
                生成分析报告
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/20 border border-gold/30 flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" />
                  Pro
                </span>
              </button>

              <p className="text-[10px] text-muted-foreground/60 text-center mt-3 font-mono">
                Demo 模式：点击生成查看示例报告
              </p>
            </div>
          </motion.div>

          {/* Right: Report Preview */}
          <div className="lg:col-span-3 space-y-5">
            {!showReport ? (
              <motion.div variants={itemVariants} className="card-gold rounded-lg bg-card p-8 text-center min-h-[500px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gold/50" />
                </div>
                <h3 className="font-mono font-semibold text-foreground mb-2">分析报告预览区</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  在左侧输入您的持仓信息，点击"生成分析报告"查看示例报告效果。
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
                  {["风险评估", "行业分布", "收益对比", "优化建议"].map((item) => (
                    <div key={item} className="flex items-center gap-2 px-3 py-2 rounded bg-secondary/50 border border-gold/10">
                      <CheckCircle className="w-3.5 h-3.5 text-gold/50" />
                      <span className="text-xs font-mono text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {/* Report Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-gold rounded-lg bg-gradient-to-br from-gold/[0.08] to-card p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gold" />
                      <h2 className="font-mono font-semibold text-sm text-foreground">组合分析报告</h2>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      生成时间: {new Date().toLocaleString("zh-CN")}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-card/60 rounded p-3 border border-gold/10">
                      <div className="text-[10px] font-mono text-muted-foreground mb-1">组合总值</div>
                      <div className="text-lg font-mono font-bold text-foreground tabular-nums">$128,450</div>
                    </div>
                    <div className="bg-card/60 rounded p-3 border border-gold/10">
                      <div className="text-[10px] font-mono text-muted-foreground mb-1">总收益率</div>
                      <div className="text-lg font-mono font-bold text-profit tabular-nums">+22.8%</div>
                    </div>
                    <div className="bg-card/60 rounded p-3 border border-gold/10">
                      <div className="text-[10px] font-mono text-muted-foreground mb-1">风险评级</div>
                      <div className="text-lg font-mono font-bold text-yellow-500">中高</div>
                    </div>
                  </div>
                </motion.div>

                {/* Sector Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card-gold rounded-lg bg-card p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <PieIcon className="w-4 h-4 text-gold" />
                    <h3 className="font-mono font-semibold text-sm text-foreground">行业分布分析</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={sampleSectorData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                            {sampleSectorData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: "rgba(17,24,39,0.95)", border: "1px solid rgba(212,168,83,0.3)", borderRadius: "6px", fontFamily: "JetBrains Mono", fontSize: "12px", color: "#e5e7eb" }} formatter={(v: number) => [`${v}%`, "占比"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col justify-center space-y-2">
                      {sampleSectorData.map((s) => (
                        <div key={s.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                          <span className="text-xs font-mono text-muted-foreground flex-1">{s.name}</span>
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: s.color }} />
                          </div>
                          <span className="text-xs font-mono text-foreground tabular-nums w-10 text-right">{s.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Risk Assessment */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card-gold rounded-lg bg-card p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-gold" />
                    <h3 className="font-mono font-semibold text-sm text-foreground">风险评估</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={sampleRiskData}>
                          <PolarGrid stroke="rgba(212,168,83,0.15)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "JetBrains Mono" }} />
                          <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                          <Radar name="风险" dataKey="A" stroke="#D4A853" fill="#D4A853" fillOpacity={0.15} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 flex flex-col justify-center">
                      {riskItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <item.icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Benchmark Comparison */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card-gold rounded-lg bg-card p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-gold" />
                    <h3 className="font-mono font-semibold text-sm text-foreground">基准对比</h3>
                  </div>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sampleBenchmarkData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,83,0.08)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "rgba(212,168,83,0.15)" }} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                        <Tooltip contentStyle={{ background: "rgba(17,24,39,0.95)", border: "1px solid rgba(212,168,83,0.3)", borderRadius: "6px", fontFamily: "JetBrains Mono", fontSize: "12px", color: "#e5e7eb" }} formatter={(v: number) => [`${v}%`]} />
                        <Bar dataKey="portfolio" name="我的组合" fill="#D4A853" radius={[3, 3, 0, 0]} opacity={0.85} />
                        <Bar dataKey="spy" name="S&P 500" fill="#3B82F6" radius={[3, 3, 0, 0]} opacity={0.6} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-3">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-gold opacity-85" /><span className="text-[10px] font-mono text-muted-foreground">我的组合</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-blue-500 opacity-60" /><span className="text-[10px] font-mono text-muted-foreground">S&P 500</span></div>
                  </div>
                </motion.div>

                {/* Optimization Suggestions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card-gold rounded-lg bg-card p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-gold" />
                    <h3 className="font-mono font-semibold text-sm text-foreground">优化建议</h3>
                  </div>
                  <div className="space-y-3">
                    {suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gold/[0.03] border border-gold/10">
                        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                          <s.icon className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                          <h4 className="text-xs font-mono font-semibold text-foreground mb-1">{s.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Pro Upsell */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="card-gold rounded-lg bg-gradient-to-br from-gold/[0.08] to-card p-5 text-center"
                >
                  <Crown className="w-6 h-6 text-gold mx-auto mb-2" />
                  <h3 className="font-mono font-semibold text-foreground mb-1">解锁完整报告</h3>
                  <p className="text-xs text-muted-foreground mb-4 max-w-md mx-auto">
                    Pro 版本提供更深度的因子分析、压力测试、蒙特卡洛模拟、个股深度研报等高级功能。
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {["因子暴露分析", "压力测试", "蒙特卡洛模拟", "个股深度研报", "PDF导出"].map((f) => (
                      <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold/10 text-gold/70 border border-gold/15">
                        {f}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => toast("Pro 版本即将上线", { description: "完整分析报告功能正在开发中，敬请期待！" })}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-mono text-sm bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 hover:border-gold/50 transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    升级 Pro
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <footer className="border-t border-gold/10 mt-8">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-muted-foreground">&copy; 2025 UC Capital. All rights reserved.</span>
          <span className="text-[10px] font-mono text-muted-foreground">分析报告仅供参考，不构成投资建议</span>
        </div>
      </footer>
    </div>
  );
}
