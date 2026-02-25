/**
 * AI Advisors Page - AI Investment Advisory Team
 * Bloomberg Terminal Neo Style
 * 5 master investor AI avatars with philosophy cards and Pro/Coming Soon badges
 */
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  Crown,
  Lock,
  MessageSquare,
  Globe,
  TrendingUp,
  BookOpen,
  Shield,
  Zap,
  Target,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

interface Advisor {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  avatar: string;
  philosophy: string;
  expertise: string[];
  quote: string;
  style: string;
  accentColor: string;
}

const advisors: Advisor[] = [
  {
    id: "buffett",
    name: "巴菲特",
    nameEn: "Warren Buffett",
    title: "价值投资之神",
    avatar: "WB",
    philosophy: "以合理价格买入优秀企业，长期持有享受复利增长。关注企业护城河、管理层质量和内在价值，远离市场噪音，做时间的朋友。",
    expertise: ["价值投资", "企业分析", "长期持有", "安全边际"],
    quote: "别人贪婪时我恐惧，别人恐惧时我贪婪。",
    style: "深度价值分析，聚焦企业基本面和长期竞争优势，偏好消费、金融、能源等传统行业的龙头公司。",
    accentColor: "#D4A853",
  },
  {
    id: "munger",
    name: "芒格",
    nameEn: "Charlie Munger",
    title: "多元思维模型",
    avatar: "CM",
    philosophy: "运用跨学科的多元思维模型做投资决策。将心理学、数学、物理学等学科智慧融入投资分析，避免常见的认知偏误，追求理性决策。",
    expertise: ["多元思维", "逆向思维", "认知偏误", "跨学科分析"],
    quote: "反过来想，总是反过来想。",
    style: "逆向思维大师，善于识别市场中的非理性行为和认知偏差，通过排除法筛选投资机会，强调能力圈和纪律性。",
    accentColor: "#8B5CF6",
  },
  {
    id: "duan",
    name: "段永平",
    nameEn: "Duan Yongping",
    title: "中国价值投资实践者",
    avatar: "DY",
    philosophy: "买股票就是买公司，做对的事情，把事情做对。深度理解商业模式，只投资自己真正懂的企业，集中持仓，长期陪伴优秀企业成长。",
    expertise: ["商业模式", "集中投资", "消费科技", "中概股"],
    quote: "做对的事情，把事情做对。",
    style: "东方价值投资实践者，深谙中美两地市场，擅长消费电子和互联网赛道，早期重仓苹果、茅台等获得巨额回报。",
    accentColor: "#EF4444",
  },
  {
    id: "dalio",
    name: "达利欧",
    nameEn: "Ray Dalio",
    title: "全天候策略 / 宏观对冲",
    avatar: "RD",
    philosophy: "通过理解经济机器的运行规律来配置资产。全天候策略实现风险平价，在任何经济环境下都能获得稳健回报，强调分散化和风险管理。",
    expertise: ["宏观经济", "全天候策略", "风险平价", "债务周期"],
    quote: "痛苦 + 反思 = 进步。",
    style: "宏观对冲大师，通过分析经济周期、债务周期和货币政策来判断大类资产配置方向，追求全天候的稳健收益。",
    accentColor: "#3B82F6",
  },
  {
    id: "fupeng",
    name: "付鹏",
    nameEn: "Fu Peng",
    title: "宏观交易 / 大类资产配置",
    avatar: "FP",
    philosophy: "从全球宏观视角出发，通过利率、汇率、商品的联动关系捕捉大类资产的趋势性机会。强调交易纪律和风险控制，在波动中寻找确定性。",
    expertise: ["全球宏观", "利率交易", "大类资产", "波动率策略"],
    quote: "宏观的核心是理解资金的流向和定价逻辑。",
    style: "新生代宏观交易专家，擅长解读全球央行政策、地缘政治对资产价格的影响，通过跨市场联动分析捕捉交易机会。",
    accentColor: "#22C55E",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function AdvisorCard({ advisor, index }: { advisor: Advisor; index: number }) {
  const handleConsult = () => {
    toast("AI 顾问功能即将上线", {
      description: `${advisor.name}的AI对话功能正在开发中，敬请期待 Pro 版本。`,
      duration: 3000,
    });
  };

  return (
    <motion.div
      variants={itemVariants}
      className="card-gold rounded-lg bg-card overflow-hidden group"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Top accent bar */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${advisor.accentColor}40, ${advisor.accentColor}, ${advisor.accentColor}40)` }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center font-mono font-bold text-lg shrink-0"
            style={{
              background: `linear-gradient(135deg, ${advisor.accentColor}20, ${advisor.accentColor}40)`,
              border: `1px solid ${advisor.accentColor}50`,
              color: advisor.accentColor,
            }}
          >
            {advisor.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-mono font-bold text-lg text-foreground">{advisor.name}</h3>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/25 flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Pro
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">{advisor.nameEn}</p>
            <p className="text-xs mt-0.5" style={{ color: advisor.accentColor }}>{advisor.title}</p>
          </div>
        </div>

        {/* Quote */}
        <div className="mb-4 pl-3 border-l-2" style={{ borderColor: `${advisor.accentColor}60` }}>
          <p className="text-xs text-muted-foreground italic leading-relaxed">"{advisor.quote}"</p>
        </div>

        {/* Philosophy */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Brain className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider">投资哲学</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{advisor.philosophy}</p>
        </div>

        {/* Style */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Target className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider">擅长领域</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{advisor.style}</p>
        </div>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {advisor.expertise.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
              style={{
                borderColor: `${advisor.accentColor}30`,
                color: advisor.accentColor,
                background: `${advisor.accentColor}10`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Consult Button */}
        <button
          onClick={handleConsult}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md font-mono text-sm transition-all border"
          style={{
            borderColor: `${advisor.accentColor}40`,
            color: advisor.accentColor,
            background: `${advisor.accentColor}08`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${advisor.accentColor}18`;
            e.currentTarget.style.borderColor = `${advisor.accentColor}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${advisor.accentColor}08`;
            e.currentTarget.style.borderColor = `${advisor.accentColor}40`;
          }}
        >
          <MessageSquare className="w-4 h-4" />
          <span>咨询 {advisor.name}</span>
          <Lock className="w-3 h-3 opacity-60" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Advisors() {
  return (
    <div className="min-h-screen pt-[66px]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] via-background to-background" />
        <div className="relative container py-10 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-gold" />
              <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">AI Advisory Team</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/25 flex items-center gap-1 ml-2">
                <Sparkles className="w-3 h-3" />
                Coming Soon
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-gold-gradient mb-2">AI 投资顾问团队</h1>
            <p className="text-muted-foreground text-sm max-w-2xl">
              五位传奇投资大师的AI数字分身，融合各自独特的投资哲学与决策框架。通过自然语言对话，获取基于大师思维模型的投资分析与建议。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="border-y border-gold/10 bg-card/30">
        <div className="container py-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { icon: MessageSquare, text: "自然语言对话" },
              { icon: BookOpen, text: "大师思维模型" },
              { icon: BarChart3, text: "实时市场分析" },
              { icon: Shield, text: "风险评估建议" },
              { icon: Globe, text: "全球宏观视角" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2">
                <f.icon className="w-4 h-4 text-gold/70" />
                <span className="text-xs font-mono text-muted-foreground">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisor Cards */}
      <motion.div
        className="container py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* First row: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {advisors.slice(0, 3).map((advisor, i) => (
            <AdvisorCard key={advisor.id} advisor={advisor} index={i} />
          ))}
        </div>
        {/* Second row: 2 cards centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {advisors.slice(3).map((advisor, i) => (
            <AdvisorCard key={advisor.id} advisor={advisor} index={i + 3} />
          ))}
        </div>

        {/* Pro CTA */}
        <motion.div variants={itemVariants} className="mt-10 text-center">
          <div className="inline-flex flex-col items-center card-gold rounded-xl bg-gradient-to-br from-gold/[0.08] to-gold/[0.03] px-8 py-6">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-gold" />
              <span className="font-mono font-bold text-gold text-lg">UC Capital Pro</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              解锁AI投资顾问对话功能，获取基于大师思维模型的个性化投资分析与实时市场解读。
            </p>
            <button
              onClick={() => toast("Pro 版本即将上线", { description: "我们正在紧锣密鼓地开发中，敬请期待！" })}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-mono text-sm bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 hover:border-gold/50 transition-all"
            >
              <Zap className="w-4 h-4" />
              即将推出 — 加入等候名单
            </button>
          </div>
        </motion.div>
      </motion.div>

      <footer className="border-t border-gold/10 mt-8">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-muted-foreground">&copy; 2025 UC Capital. All rights reserved.</span>
          <span className="text-[10px] font-mono text-muted-foreground">AI顾问建议仅供参考，不构成投资建议</span>
        </div>
      </footer>
    </div>
  );
}
