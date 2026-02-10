import { motion } from "framer-motion";
import { Shield, Zap, Smartphone, DollarSign, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignupDialog } from "./SignupDialog";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const features = [
    { icon: Zap, label: "Instant Deposits" },
    { icon: DollarSign, label: "Zero Commission" },
    { icon: Smartphone, label: "Mobile-First" },
  ];

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-hero-pattern pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] hero-glow pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Shield className="w-4 h-4" />
            Pakistan's First Vertically-Integrated Investment Platform
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Invest in{" "}
            <span className="text-gradient">Pakistan's Future</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Trade PSX stocks instantly with zero commission. Your bank account and 
            brokerage in one seamless app. Built for the next generation of Pakistani investors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <SignupDialog>
              <Button size="lg" className="glow-primary text-lg px-8 h-14">
                <Rocket className="w-5 h-5 mr-2" />
                Join the Waitlist
              </Button>
            </SignupDialog>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-sm"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span>{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
