/**
 * Navbar - Bloomberg Terminal Neo Style
 * Deep dark translucent background with gold border accent
 * Fixed top navigation with glass morphism effect
 */
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Brain, FileText, Menu, X, Crown, CreditCard, Calculator } from "lucide-react";
import { useState } from "react";

const LOGO_URL = "https://private-us-east-1.manuscdn.com/sessionFile/YaP317eOKyuIkprNnugzm7/sandbox/Ac3WClDop2IEMcCR2v0NAv-img-4_1771981296000_na1fn_bG9nby1pY29u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWWFQMzE3ZU9LeXVJa3ByTm51Z3ptNy9zYW5kYm94L0FjM1dDbERvcDJJRU1jQ1IydjBOQXYtaW1nLTRfMTc3MTk4MTI5NjAwMF9uYTFmbl9iRzluYnkxcFkyOXUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=gqM93T8NOI-aG~XzlFm-rRjAjtmGIm5sXGGBPTkq2M4yGXTq7KDGDFR2iQEg0MDpMIlQtHEwWsQczUsQ2k5yQcqSeAVlY8ktiHQDJ~7b58PKzWvfPcmII0PCsEzAKRfNXC0yZrY3RhgLhe7eQvkSDeBUoItPD-xiy3zNkq~PuoH~c3XtLV~eQCe2lBXM0t5IEGCE5CCCTCZK2-oN4ZW63ecszbj-lR60k99VfZPmNU5YkOzjs8lXmARiOnJhJLZFidn6qpn7bZVV-oLsjTkqDcCpd3dZafniQa5VRm3iCDdDmdElki~MbEHOM79fbHTPQKxGAx3sjZSGnFFmTYqjLA__";

const navItems = [
  { href: "/", label: "市场概览", icon: TrendingUp, badge: null },
  { href: "/portfolio", label: "旗舰组合", icon: BarChart3, badge: null },
  { href: "/advisors", label: "AI 顾问", icon: Brain, badge: "Pro" },
  { href: "/analysis", label: "组合分析", icon: FileText, badge: "Pro" },
  { href: "/dca", label: "DCA Powerhouse", icon: Calculator, badge: null },
  { href: "/pricing", label: "订阅 Pro", icon: Crown, badge: null },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-[2px] left-0 right-0 z-50">
      <div
        className="border-b"
        style={{
          background: "rgba(10, 14, 23, 0.85)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(212, 168, 83, 0.25)",
        }}
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img src={LOGO_URL} alt="UC Capital" className="w-9 h-9 rounded" />
              <div className="flex flex-col">
                <span className="text-gold-gradient font-mono font-bold text-lg leading-tight tracking-wide">
                  UC Capital
                </span>
                <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-mono">
                  Smart Investment Terminal
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-colors ${
                      isActive
                        ? "text-gold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    whileHover={{ y: -1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1 py-0 rounded bg-gold/15 text-gold border border-gold/25 leading-relaxed">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-[2px]"
                        style={{
                          background: "linear-gradient(90deg, transparent, #D4A853, transparent)",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Live indicator + Pro CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/pricing">
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold"
                style={{
                  background: "linear-gradient(135deg, rgba(212,168,83,0.2), rgba(212,168,83,0.08))",
                  border: "1px solid rgba(212,168,83,0.35)",
                  color: "#D4A853",
                }}
              >
                <Crown className="w-3 h-3" />
                升级 Pro
              </motion.button>
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gold/20 bg-gold/5">
              <div className="w-2 h-2 rounded-full bg-profit data-pulse" />
              <span className="text-xs font-mono text-gold-light">LIVE</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gold/10 px-4 py-3"
            style={{ background: "rgba(10, 14, 23, 0.95)" }}
          >
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-3 rounded-md font-mono text-sm ${
                      isActive ? "text-gold bg-gold/10" : "text-muted-foreground"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1 py-0 rounded bg-gold/15 text-gold border border-gold/25 leading-relaxed ml-auto">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </nav>
  );
}
