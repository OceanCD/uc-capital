# UC Capital - Project TODO

## Core Pages
- [x] 首页 - 市场概览、实时股价、新闻分析
- [x] 旗舰组合页面 - SPY/QQQ对比收益曲线、超额收益标签、持仓明细、行业分布
- [x] AI 投资顾问团队页面 - 5位大师卡片（巴菲特、芒格、段永平、达利欧、付鹏）
- [x] 投资组合分析报告页面 - 上传持仓、示例报告、Pro 标签

## Navigation
- [x] 导航栏 - 深色半透明背景+金色边框
- [x] 导航栏 - 旗舰组合入口
- [x] 导航栏 - AI 顾问入口
- [x] 导航栏 - 组合分析入口
- [x] 导航栏 - 订阅 Pro 入口 + 升级 Pro 按钮

## Individual Stock Features
- [x] 首页个股可点击弹窗（PE/PB/核心叙事/财报解读）
- [x] 旗舰组合个股可展开详情行（估值/叙事/财报）

## News Module
- [x] 新闻四级分类（宏观/产业/行业/个股）
- [x] 传导链路展示
- [x] 个股影响标注
- [x] 5+5 折叠展示
- [x] 新闻栏更宽、个股栏更窄

## Daily Market Analysis
- [x] 情绪面（雷达图 + 文字解析）
- [x] 基本面（财报季数据）
- [x] 技术面（支撑位/阻力位/MACD/RSI）
- [x] 本周预测（重要事件日历）

## Database
- [x] 数据库 Schema 设计（7张表）
- [x] market_indices 表
- [x] stocks 表
- [x] news_items 表
- [x] portfolio_holdings 表
- [x] portfolio_performance 表
- [x] daily_analysis 表
- [x] users 表（含 Stripe 字段）
- [x] 数据库 Schema 推送成功

## Stripe Payment
- [x] Stripe 包安装（stripe + @stripe/stripe-js）
- [x] 产品定义（PRO_MONTHLY $99/月、PRO_ANNUAL $79.2/月）
- [x] Stripe Webhook 处理器（checkout.session.completed / subscription.deleted）
- [x] tRPC stripe 路由（createCheckout / getSubscription / createPortalSession）
- [x] 定价页面（月度/年度切换、免费/Pro 对比、FAQ）
- [x] 支付成功页面
- [x] Vitest 测试通过

## Design
- [x] 深色主题（#0A0E17 背景）
- [x] 金色点缀（#D4A853 主色）
- [x] Bloomberg Terminal 风格
- [x] 顶部金色渐变线
- [x] 响应式布局

## Deployment
- [x] 保存检查点
- [ ] 发布上线
- [ ] 绑定 uccapital.ai 域名
