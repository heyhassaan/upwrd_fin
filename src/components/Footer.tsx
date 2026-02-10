import { motion } from "framer-motion";
import { ChevronUp, Sparkles, Rocket, Building2, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-16">
        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <ChevronUp className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">
              Upwrd<span className="text-primary">Fin</span>
            </span>
          </Link>

          {/* Spacer */}
          <div className="h-12" />

          {/* Coming Soon Badge */}
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">Coming Soon</span>
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Bank. Your Broker.{" "}
            <span className="text-gradient">One App.</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Pakistan's first vertically-integrated investment platform. 
            Instant deposits, zero commission trading, and your very own bank account — 
            all in one seamless experience.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary border border-border"
            >
              <Building2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Microfinance Bank</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary border border-border"
            >
              <Rocket className="w-5 h-5 text-primary" />
              <span className="font-medium">Licensed Brokerage</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary border border-border"
            >
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="font-medium">Debit Card</span>
            </motion.div>
          </div>

          {/* Tagline */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
            <p className="text-xl md:text-2xl font-semibold text-gradient">
              "Democratizing wealth creation for 240 million Pakistanis"
            </p>
          </div>
        </motion.div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 UpwrdFin. All rights reserved.</p>
          <p>
            Regulated by SBP & SECP. Member PSX, CDC, NCCPL.
          </p>
        </div>
      </div>
    </footer>
  );
};
