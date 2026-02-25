/**
 * UC Capital - Stripe Products & Pricing
 * Centralized product definitions for subscription plans
 */

export const PRODUCTS = {
  PRO_MONTHLY: {
    name: "UC Capital Pro - 月度订阅",
    description: "解锁 AI 投资顾问、组合分析报告等全部 Pro 功能",
    price: 9900, // $99.00 in cents
    currency: "usd",
    interval: "month" as const,
    features: [
      "AI 投资顾问团队（5位大师）无限咨询",
      "一键生成投资组合分析报告",
      "旗舰组合实时持仓更新",
      "每日市场深度解析",
      "个股传导链路新闻推送",
      "优先客户支持",
    ],
  },
  PRO_ANNUAL: {
    name: "UC Capital Pro - 年度订阅",
    description: "年度订阅享受 8 折优惠，解锁全部 Pro 功能",
    price: 95040, // $950.40 in cents (20% off $99*12=$1188)
    currency: "usd",
    interval: "year" as const,
    features: [
      "包含所有月度 Pro 功能",
      "年度订阅节省 $237.60",
      "专属年度用户报告",
      "新功能优先体验资格",
    ],
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
