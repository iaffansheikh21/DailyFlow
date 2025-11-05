"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Zap, Shield, BarChart3, Clock, Layers } from "lucide-react"
import { useAuth } from "@/context/AuthContext"



export default function LandingPage() {
  const router = useRouter()
  const { token, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

 
useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) return null

  // Avoid SSR mismatches
  if (!mounted || isLoading) return null

  const features = [
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "Simple & Intuitive",
      description: "Create and manage todos effortlessly with a distraction-free design.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Real-time sync ensures your tasks update instantly across devices.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure",
      description: "Your tasks and data are encrypted and stored safely in the cloud.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Track Progress",
      description: "Visualize your productivity with smart analytics and completion stats.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Prioritize and schedule your todos with due dates and reminders.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Stay Organized",
      description: "Group tasks by status and priority to keep your work structured.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.h1 className="text-2xl font-bold text-foreground">TodoFlow</motion.h1>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-border bg-transparent">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 py-20 md:py-32"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              The Future of Task Management
            </span>

            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Stay Productive, Stay Organized
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              TodoFlow helps you organize tasks, manage deadlines, and boost productivity — all in one place.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link href="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border px-8 bg-transparent">
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block"
          >
            <div className="relative h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/30 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-center"
              >
                <Zap className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-foreground font-semibold">Dashboard Preview</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section className="py-16 border-y border-border">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-4 gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: "10K+", label: "Active Users" },
              { number: "50K+", label: "Tasks Completed" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <p className="text-4xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Powerful Features to Boost Productivity
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay organized and achieve your goals
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="bg-card border-border p-6 h-full hover:shadow-lg transition-shadow group">
                  <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 border-t border-border"
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users already managing their tasks smarter with TodoFlow.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Start for Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border px-8 bg-transparent">
              Schedule Demo
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} TodoFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
