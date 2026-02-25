/**
 * UC Capital - Pricing & Subscription Page
 * Pro subscription plans with Stripe checkout
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Crown,
  Zap,
  BarChart3,
  Brain,
  Shield,
  Star,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

const PRO_FEATURES = [
  { icon: Brain, text: "AI 投资顾问团队（5位大师）无限咨询" },
  { icon: BarChart3, text: "一键生成投资组合分析报告" },
  { icon: Zap, text: "旗舰组合实时持仓更新" },
  { icon: Star, text: "每日市场深度解析（情绪面/基本面/技术面）" },
  { icon: Shield, text: "个股传导链路新闻推送" },
  { icon: Crown, text: "优先客户支持 & 新功能优先体验" },
];

const FREE_FEATURES = [
  "市场概览与指数追踪",
  "热门个股实时行情",
  "基础新闻资讯（有限条数）",
  "旗舰组合公开展示",
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user } = useAuth();

  const { data: subscription } = trpc.stripe.getSubscription.useQuery();
  const createCheckout = trpc.stripe.createCheckout.useMutation();
  const createPortal = trpc.stripe.createPortalSession.useMutation();

  const handleSubscribe = async (plan: "PRO_MONTHLY" | "PRO_ANNUAL") => {
    setLoadingPlan(plan);
    try {
      toast.info("正在跳转到支付页面...", { duration: 3000 });
      const result = await createCheckout.mutateAsync({
        plan,
        origin: window.location.origin,
      });
      if (result.url) {
        window.open(result.url, "_blank");
      }
    } catch (err) {
      toast.error("创建支付会话失败，请稍后重试");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPlan("portal");
    try {
      const result = await createPortal.mutateAsync({
        origin: window.location.origin,
      });
      if (result.url) {
        window.open(result.url, "_blank");
      }
    } catch (err) {
      toast.error("无法打开订阅管理页面，请稍后重试");
    } finally {
      setLoadingPlan(null);
    }
  };

  const monthlyPrice = 99;
  const annualPrice = 79.2; // 20% off
  const currentPrice = billingCycle === "monthly" ? monthlyPrice : annualPrice;
  const annualSavings = (monthlyPrice - annualPrice) * 12;

  return (
    <div className="min-h-screen pt-[66px] pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.3) 0%, transparent 70%)",
          }}
        />
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-6">
              <Crown className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs font-mono text-gold">UC Capital Pro</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-mono font-bold text-gold-gradient mb-4">
              解锁专业投资终端
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              订阅 Pro 计划，获得 AI 投资顾问、组合分析报告等全套专业功能，让每一个投资决策都有数据支撑。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Billing Toggle */}
      <div className="container flex justify-center mb-10">
        <div
          className="inline-flex rounded-lg p-1"
          style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.2)" }}
        >
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-md text-sm font-mono transition-all ${
              billingCycle === "monthly"
                ? "bg-gold text-background font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            月度订阅
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-5 py-2 rounded-md text-sm font-mono transition-all flex items-center gap-2 ${
              billingCycle === "annual"
                ? "bg-gold text-background font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            年度订阅
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                billingCycle === "annual"
                  ? "bg-background/20 text-background"
                  : "bg-profit/20 text-profit"
              }`}
            >
              省20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl p-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,83,0.15)" }}
          >
            <div className="mb-6">
              <h2 className="text-lg font-mono font-semibold text-foreground mb-1">免费版</h2>
              <p className="text-sm text-muted-foreground">基础市场数据，永久免费</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-mono font-bold text-foreground">$0</span>
              <span className="text-muted-foreground font-mono text-sm ml-2">/ 永久</span>
            </div>
            <div className="space-y-3 mb-8">
              {FREE_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            <Link href="/">
              <button className="w-full py-2.5 rounded-lg border border-gold/20 text-muted-foreground hover:text-foreground hover:border-gold/40 font-mono text-sm transition-colors">
                当前计划
              </button>
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(212,168,83,0.12) 0%, rgba(212,168,83,0.04) 100%)",
              border: "1px solid rgba(212,168,83,0.4)",
            }}
          >
            {/* Popular badge */}
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-gold text-background">
                推荐
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-gold" />
                <h2 className="text-lg font-mono font-semibold text-gold">Pro 版</h2>
              </div>
              <p className="text-sm text-muted-foreground">全套专业功能，AI 赋能投资决策</p>
            </div>

            <div className="mb-2">
              <span className="text-4xl font-mono font-bold text-foreground">
                ${currentPrice.toFixed(0)}
              </span>
              <span className="text-muted-foreground font-mono text-sm ml-2">
                / {billingCycle === "monthly" ? "月" : "月（年付）"}
              </span>
            </div>

            {billingCycle === "annual" && (
              <p className="text-xs text-profit font-mono mb-6">
                年付节省 ${annualSavings.toFixed(0)} · 相当于免费用 2.4 个月
              </p>
            )}
            {billingCycle === "monthly" && <div className="mb-6" />}

            <div className="space-y-3 mb-8">
              {PRO_FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3 text-gold" />
                  </div>
                  <span className="text-sm text-foreground/90">{text}</span>
                </div>
              ))}
            </div>

            {subscription?.isPro ? (
              <div className="space-y-3">
                <div className="w-full py-2.5 rounded-lg bg-profit/15 border border-profit/30 text-profit font-mono text-sm text-center flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  当前已订阅 Pro
                </div>
                <button
                  onClick={handleManageSubscription}
                  disabled={loadingPlan === "portal"}
                  className="w-full py-2 rounded-lg border border-gold/20 text-muted-foreground hover:text-foreground font-mono text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loadingPlan === "portal" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "管理订阅"
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  handleSubscribe(
                    billingCycle === "monthly" ? "PRO_MONTHLY" : "PRO_ANNUAL"
                  )
                }
                disabled={loadingPlan !== null}
                className="w-full py-3 rounded-lg font-mono font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #D4A853, #F5D799)",
                  color: "#0A0E17",
                }}
              >
                {loadingPlan ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    立即订阅 Pro
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            <p className="text-center text-[10px] text-muted-foreground mt-3 font-mono">
              支持随时取消 · 安全支付由 Stripe 保障
            </p>
          </motion.div>
        </div>

        {/* Test card notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 rounded-lg text-center"
          style={{ background: "rgba(212,168,83,0.05)", border: "1px solid rgba(212,168,83,0.15)" }}
        >
          <p className="text-xs font-mono text-muted-foreground">
            <span className="text-gold font-semibold">测试模式</span> · 使用测试卡号{" "}
            <span className="text-foreground font-mono">4242 4242 4242 4242</span>（任意有效期和 CVV）进行测试支付
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-center font-mono font-semibold text-foreground mb-6">常见问题</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: "可以随时取消订阅吗？",
                a: "可以，您可以随时通过订阅管理页面取消，取消后当前计费周期结束前仍可使用 Pro 功能。",
              },
              {
                q: "支持哪些支付方式？",
                a: "支持所有主流信用卡和借记卡（Visa、Mastercard、American Express 等），由 Stripe 安全处理。",
              },
              {
                q: "年度订阅有什么优惠？",
                a: "年度订阅享受 8 折优惠，相当于每年节省 $237.60，等同于免费使用约 2.4 个月。",
              },
              {
                q: "AI 顾问功能如何使用？",
                a: "订阅 Pro 后，在 AI 顾问页面可以向 5 位投资大师 AI 版本提问，获取基于其投资哲学的分析建议。",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-4 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,168,83,0.1)" }}
              >
                <p className="text-sm font-mono font-semibold text-foreground mb-2">{faq.q}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
