import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Target,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Users,
  DollarSign,
  Building,
  Rocket,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { businessPlanSections } from "@/data/businessPlan";

const iconMap: Record<string, React.ElementType> = {
  "executive-summary": Target,
  "the-problem": Lightbulb,
  "the-solution": Zap,
  "market-size": TrendingUp,
  "competitive-advantage": Shield,
  "business-model": DollarSign,
  vision: Rocket,
  mission: Users,
};

const About = () => {
  const [activeSection, setActiveSection] = useState("executive-summary");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Why <span className="text-gradient">UpwrdFin</span>?
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover how we're building Pakistan's first vertically-integrated 
              investment platform to bring stock market investing to 240 million people.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-72 shrink-0"
            >
              <div className="lg:sticky lg:top-24 space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                  Contents
                </h3>
                {businessPlanSections.map((section) => {
                  const Icon = iconMap[section.id] || Building;
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{section.title}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </motion.aside>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-12">
              {businessPlanSections.map((section, sectionIndex) => {
                const Icon = iconMap[section.id] || Building;

                return (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: sectionIndex * 0.05 }}
                    onViewportEnter={() => setActiveSection(section.id)}
                    className="scroll-mt-28"
                  >
                    <div className="stock-card rounded-2xl p-6 md:p-8 border border-border/50">
                      {/* Section Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold">
                            {section.title}
                          </h2>
                        </div>
                      </div>

                      {/* Main Content */}
                      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        {section.content}
                      </p>

                      {/* Highlights Grid */}
                      {section.highlights && section.highlights.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          {section.highlights.map((highlight, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                              className="bg-secondary/50 rounded-xl p-4 border border-border/30"
                            >
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                {highlight.label}
                              </p>
                              <p className="text-xl font-bold text-primary">
                                {highlight.value}
                              </p>
                              {highlight.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {highlight.description}
                                </p>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Subsections */}
                      {section.subsections && section.subsections.length > 0 && (
                        <div className="space-y-6">
                          {section.subsections.map((subsection, i) => (
                            <div
                              key={i}
                              className="border-l-2 border-primary/30 pl-4 md:pl-6"
                            >
                              <h3 className="text-lg font-semibold mb-2">
                                {subsection.title}
                              </h3>
                              <p className="text-muted-foreground mb-4">
                                {subsection.content}
                              </p>
                              {subsection.data && (
                                <div className="grid gap-2">
                                  {subsection.data.map((item, j) => (
                                    <div
                                      key={j}
                                      className="flex items-start gap-3 text-sm"
                                    >
                                      <span className="text-muted-foreground min-w-[120px] md:min-w-[180px]">
                                        {item.label}:
                                      </span>
                                      <span className="font-medium">
                                        {item.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.section>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
