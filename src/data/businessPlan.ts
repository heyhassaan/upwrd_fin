// Business plan content structured for the About page
export interface Section {
  id: string;
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
    data?: { label: string; value: string }[];
  }[];
  highlights?: { label: string; value: string; description?: string }[];
}

export const businessPlanSections: Section[] = [
  {
    id: "executive-summary",
    title: "Executive Summary",
    content:
      "UpwrdFin is Pakistan's first vertically-integrated retail investment platform, combining a Microfinance Bank, Brokerage House, and Technology Company into one seamless super app. Our mission is to democratize stock market investing by creating a user-friendly, mobile-first trading application with instant fund deposits, zero commissions, and exceptional user experience.",
    highlights: [
      { label: "PSX Market Cap", value: "PKR 24 Trillion", description: "~$85B large, liquid market" },
      { label: "Active Retail Traders", value: "~300,000", description: "Only 0.12% penetration" },
      { label: "Total Population", value: "240+ Million", description: "Massive untapped market" },
      { label: "Population Under 35", value: "70%", description: "Digital-native demographic" },
      { label: "Smartphone Users", value: "60+ Million", description: "Distribution channel ready" },
      { label: "Annual Remittances", value: "$30+ Billion", description: "Diaspora opportunity" },
    ],
  },
  {
    id: "the-problem",
    title: "The Problem Statement",
    content:
      "Current Pakistani trading platforms suffer from three critical issues that prevent the masses from participating in wealth creation through the stock market.",
    subsections: [
      {
        title: "Outdated, Complex Interfaces",
        content:
          "Legacy broker platforms designed for professionals, not retail investors. Intimidating charts, jargon, complex order types, and multi-step processes to execute simple trades. No mobile-first design.",
      },
      {
        title: "T+2 Settlement Cycles",
        content:
          "Funds locked for 2 business days after trade. Can't reinvest proceeds quickly. Creates cash flow issues for active traders. (Note: Moving to T+1 on Feb 9, 2026)",
      },
      {
        title: "No Real-Time Fund Deposits",
        content:
          "Takes 24-48 hours to add money to brokerage account. Misses market opportunities. Discourages impulse investing. Poor user experience.",
      },
    ],
  },
  {
    id: "the-solution",
    title: "Our Solution",
    content:
      "We are building Pakistan's first vertically-integrated retail investment platform with a three-entity structure that enables instant trading while staying fully compliant with regulations.",
    subsections: [
      {
        title: "Microfinance Bank",
        content:
          "SBP MFB License for bank accounts, deposits, credit, and debit cards. This is the foundation that enables instant deposits.",
        data: [
          { label: "License", value: "SBP MFB License" },
          { label: "Capital", value: "PKR 1 Billion ($3.5M)" },
          { label: "Functions", value: "Bank accounts, deposits, credit, debit cards" },
        ],
      },
      {
        title: "Brokerage House",
        content:
          "SECP TREC License for trade execution, CDC custody, settlement, and research.",
        data: [
          { label: "License", value: "SECP TREC" },
          { label: "Capital", value: "PKR 200M ($700K)" },
          { label: "Functions", value: "Trade execution, CDC custody, settlement" },
        ],
      },
      {
        title: "Technology Company",
        content:
          "The mobile app, backend systems, marketing, and customer support operations.",
        data: [
          { label: "License", value: "SECP Pvt Ltd" },
          { label: "Capital", value: "PKR 100M ($350K)" },
          { label: "Functions", value: "Mobile app, backend, marketing, support" },
        ],
      },
    ],
  },
  {
    id: "market-size",
    title: "Market Size Analysis",
    content:
      "Pakistan represents a massive untapped market for retail investing with only 0.12% penetration compared to 5.7% in India and 4% in Indonesia.",
    highlights: [
      { label: "TAM", value: "$7.2 Billion", description: "Total addressable market in investable assets" },
      { label: "SAM", value: "$1.3 Billion", description: "Serviceable addressable market" },
      { label: "SOM (Year 5)", value: "$875 Million", description: "~500,000 users target" },
      { label: "Revenue Potential", value: "$20-25M/year", description: "Including float income" },
    ],
    subsections: [
      {
        title: "Growth Drivers",
        content: "Multiple factors are converging to accelerate market growth:",
        data: [
          { label: "T+1 Settlement", value: "Feb 2026 - Increases trading velocity" },
          { label: "Raast Payments", value: "Enables instant deposits now" },
          { label: "Rising Middle Class", value: "More investable income" },
          { label: "Youth Demographics", value: "70% under 35, digital native" },
          { label: "Diaspora Investment", value: "RDA accounts growing" },
        ],
      },
    ],
  },
  {
    id: "competitive-advantage",
    title: "Competitive Advantage",
    content:
      "Our vertically-integrated model gives us unmatched advantages in the Pakistani market.",
    subsections: [
      {
        title: "What Makes Us Different",
        content: "The only platform where your bank account and brokerage account are one and the same.",
        data: [
          { label: "Own Bank Account", value: "✅ Real IBAN numbers" },
          { label: "Instant Deposits", value: "✅ Others take 24-48 hours" },
          { label: "Zero Commission", value: "✅ Make money on float, not fees" },
          { label: "Mobile-First Design", value: "✅ Built for smartphones" },
          { label: "Own Brokerage", value: "✅ Full control, no revenue sharing" },
          { label: "Debit Card", value: "✅ Linked to trading account" },
        ],
      },
    ],
  },
  {
    id: "business-model",
    title: "Business Model & Revenue",
    content:
      "Our diversified revenue model ensures profitability while keeping trading free for users.",
    highlights: [
      { label: "Year 1 Revenue", value: "$500K", description: "Launch & prove product-market fit" },
      { label: "Year 3 Revenue", value: "$6M", description: "Scale with multiple products" },
      { label: "Year 5 Revenue", value: "$25M", description: "Market leader position" },
    ],
    subsections: [
      {
        title: "Revenue Streams",
        content: "Multiple revenue sources create a sustainable business:",
        data: [
          { label: "Float Income", value: "Primary - 13-15% net interest margin on deposits" },
          { label: "Premium Subscriptions", value: "PKR 500-1,500/month for advanced features" },
          { label: "Card Interchange", value: "Fees from debit card transactions" },
          { label: "Margin Lending", value: "Interest on leverage trading" },
          { label: "Mutual Funds", value: "Commission from AMCs" },
          { label: "IPO Distribution", value: "Fees for guaranteed allocation" },
        ],
      },
      {
        title: "Unit Economics",
        content: "Strong unit economics ensure long-term profitability:",
        data: [
          { label: "Revenue per User", value: "$65/year at scale" },
          { label: "Cost per User", value: "$15/year + $5 CAC" },
          { label: "Contribution Margin", value: "$50/year per user" },
          { label: "LTV:CAC Ratio", value: "50x (excellent)" },
          { label: "Payback Period", value: "1.2 months" },
        ],
      },
    ],
  },
  {
    id: "vision",
    title: "5-Year Vision",
    content:
      "We're not just building an app—we're building the financial infrastructure to bring stock market investing to 240 million Pakistanis.",
    highlights: [
      { label: "Year 1", value: "100K Users", description: "$20M AUM - Launch & prove PMF" },
      { label: "Year 2", value: "500K Users", description: "$150M AUM - Scale, add mutual funds" },
      { label: "Year 3", value: "1.5M Users", description: "$500M AUM - Market leader, add lending" },
      { label: "Year 4", value: "3M Users", description: "$1.2B AUM - Expand to diaspora" },
      { label: "Year 5", value: "5M Users", description: "$2.5B AUM - IPO-ready" },
    ],
  },
  {
    id: "mission",
    title: "Our Mission",
    content:
      '"To democratize wealth creation by making stock market investing accessible, instant, and free for every Pakistani."',
  },
];
