import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Menu, X, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMarketStatus } from "@/data/stocks";
import { SignupDialog } from "./SignupDialog";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketStatus(getMarketStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { path: "/", label: "Markets" },
    { path: "/about", label: "Why UpwrdFin" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
            >
              <ChevronUp className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold text-foreground">
              Upwrd<span className="text-primary">Fin</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? "market-open" : "market-closed"}`} />
              <span className="text-muted-foreground">{marketStatus.message}</span>
            </div>
            <SignupDialog>
              <Button size="sm" className="glow-primary">
                <Rocket className="w-4 h-4 mr-2" />
                Get Early Access
              </Button>
            </SignupDialog>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-foreground">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 text-sm pt-2">
                <span className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? "market-open" : "market-closed"}`} />
                <span className="text-muted-foreground">{marketStatus.message}</span>
              </div>
              <SignupDialog>
                <Button className="mt-2 glow-primary">
                  <Rocket className="w-4 h-4 mr-2" />
                  Get Early Access
                </Button>
              </SignupDialog>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};
