/**
 * UC Capital - Subscription Success Page
 * Shown after successful Stripe checkout
 */
import { motion } from "framer-motion";
import { Crown, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function SubscriptionSuccess() {
  return (
    <div className="min-h-screen pt-[66px] flex items-center justify-center">
      <div className="container max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(212,168,83,0.2), rgba(212,168,83,0.05))",
                border: "2px solid rgba(212,168,83,0.4)",
              }}
            >
              <CheckCircle2 className="w-10 h-10 text-gold" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-gold" />
            <h1 className="text-2xl font-mono font-bold text-gold-gradient">
              欢迎加入 UC Capital Pro！
            </h1>
          </div>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            您的 Pro 订阅已激活。现在可以使用 AI 投资顾问、组合分析报告等全套专业功能了。
          </p>

          <div
            className="rounded-xl p-5 mb-8 text-left space-y-3"
            style={{
              background: "rgba(212,168,83,0.06)",
              border: "1px solid rgba(212,168,83,0.2)",
            }}
          >
            <p className="text-sm font-mono font-semibold text-gold mb-3">已解锁的 Pro 功能：</p>
            {[
              "AI 投资顾问团队（5位大师）无限咨询",
              "一键生成投资组合分析报告",
              "旗舰组合实时持仓更新",
              "每日市场深度解析",
              "个股传导链路新闻推送",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-profit shrink-0" />
                <span className="text-sm text-foreground/90">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/advisors">
              <button
                className="px-6 py-2.5 rounded-lg font-mono font-semibold text-sm flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #D4A853, #F5D799)",
                  color: "#0A0E17",
                }}
              >
                立即体验 AI 顾问
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/">
              <button className="px-6 py-2.5 rounded-lg border border-gold/20 text-muted-foreground hover:text-foreground font-mono text-sm transition-colors">
                返回首页
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
