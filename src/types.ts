/**
 * Types and schemas for the Dojo Intelligence Insights Agent
 */

export enum AnalysisModuleType {
  SITE_UNDERPERFORMANCE = "SITE_UNDERPERFORMANCE",
  CUSTOMER_LOYALTY = "CUSTOMER_LOYALTY",
  CAMPAIGN_IMPACT = "CAMPAIGN_IMPACT",
  CANNIBALISATION = "CANNIBALISATION",
}

export interface AnalysisModule {
  id: AnalysisModuleType;
  title: string;
  description: string;
  requiredParams: string[];
  dbtModels: string[];
  metrics: { name: string; description: string; definition: string }[];
}

export interface AnalysisParameters {
  clientName: string;
  merchantId: string;
  dateRange: string;
  locationRegion: string;
  competitorSector: string;
  selectedMetrics: string[];
  // Module 1: Site Underperformance Diagnostic
  comparisonBenchmark: string; // "other sites" | "sector average" | "prior period"
  leadMetric: string; // "revenue" | "transactions" | "basket size" | "frequency"
  // Module 2: Customer Loyalty & Frequency Analysis
  newVsReturningSplit: string; // "yes" | "no"
  targetFrequency: string; // "visits per month" | "visits per quarter"
  // Module 3: Campaign / Event Impact Analysis
  campaignHours: string; // "all day" | "post-3pm" | "lunch time"
  comparisonWindow: string; // "same period prior month" | "same period prior year" | "non-campaign days"
  primaryMetric: string; // "revenue" | "transaction volume" | "basket size"
  // Module 4: Cross-Site Cannibalisation Analysis
  overlapDefinition: string; // "customers visiting more than one site in the period"
  includeVisitFrequency: string; // "yes" | "no"
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  extractedParams?: Partial<AnalysisParameters>; // Suggested parameters extracted from speech
}

export interface MetricComparison {
  metric: string;
  clientValue: number;
  benchmarkValue: number;
  differencePercent: number;
  status: "above" | "below" | "inline";
}

export interface TimeSeriesPoint {
  period: string;
  revenue: number;
  transactions: number;
  avgSpend: number;
  newCustomers: number;
  returningCustomers: number;
}

export interface DaySplitPoint {
  day: string;
  revenuePercent: number;
  transactionPercent: number;
  avgSpend: number;
}

export interface CardOriginPoint {
  origin: string;
  revenuePercent: number;
  transactionCount: number;
  avgSpend: number;
}

export interface AnalysisOutput {
  metadata: {
    clientName: string;
    merchantId: string;
    moduleType: AnalysisModuleType;
    moduleTitle: string;
    dateRange: string;
    locations: string;
    sector: string;
    dbtModelsUsed: string[];
    generatedAt: string;
    sanityChecked: boolean;
    recordsProcessed: number;
  };
  keyMetrics: {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    definition: string;
  }[];
  comparisons: MetricComparison[];
  timeSeries: TimeSeriesPoint[];
  splits: {
    dayOfWeek?: DaySplitPoint[];
    hourOfDay?: { hour: string; revenuePercent: number; transactions: number }[];
    cardOrigin?: CardOriginPoint[];
  };
  narrative: {
    executiveSummary: string;
    keyAchievements: string[];
    growthOpportunities: string[];
    clientNarrative: string; // The ready-to-copy client-ready text
  };
}

export const PRE_APPROVED_MODULES: AnalysisModule[] = [
  {
    id: AnalysisModuleType.SITE_UNDERPERFORMANCE,
    title: "1. Site Underperformance Diagnostic",
    description: "Identify and rank underlying drivers for underperforming sites against peer cohorts or prior periods.",
    requiredParams: ["clientName", "dateRange", "comparisonBenchmark", "leadMetric"],
    dbtModels: ["fct_dojo_transactions_daily", "dim_merchants_curated", "fct_competitor_sector_benchmarks"],
    metrics: [
      { name: "Sales Revenue Impact", description: "Estimated revenue loss/gain against benchmark", definition: "sum(transaction_amount_gbp) - benchmark_valuation" },
      { name: "Transaction Count Shift", description: "The drop/rise in total settled transactions", definition: "count(transaction_id) - benchmark_transactions" },
      { name: "Basket Size Premium", description: "Merchant average spend compared to sector mean", definition: "avg_spend - avg_sector_spend" },
      { name: "Visit Frequency Gap", description: "Average transaction rate difference vs cohort standard", definition: "average_customer_visits - average_cohort_visits" },
    ],
  },
  {
    id: AnalysisModuleType.CUSTOMER_LOYALTY,
    title: "2. Customer Loyalty & Frequency Analysis",
    description: "Break down customer visit frequency distributions, visits per customer, and repeat-visit intervals to target loyalists.",
    requiredParams: ["clientName", "dateRange", "newVsReturningSplit", "targetFrequency"],
    dbtModels: ["fct_loyalty_customer_cohorts", "dim_dojo_payment_tokens"],
    metrics: [
      { name: "Customer Visit Frequency", description: "Average visits per active cardholder in the selected period", definition: "total_transactions / distinct_cardholder_tokens" },
      { name: "New vs Returning Ratio", description: "Proportion of first-time shoppers compared to returning base", definition: "count(new_customer_tokens) / count(total_tokens)" },
      { name: "Spend per Customer", description: "Aggregated period spend per unique cardholder token", definition: "sum(transaction_amount_gbp) / count(distinct_customer_tokens)" },
      { name: "Average Visit Cadence", description: "The average days between repeat customer visits", definition: "mean(days_between_visits) across repeating payment tokens" },
    ],
  },
  {
    id: AnalysisModuleType.CAMPAIGN_IMPACT,
    title: "3. Campaign / Event Impact Analysis",
    description: "Determine sales and transaction lifts during specific promotions, campaigns, or seasonal windows.",
    requiredParams: ["clientName", "dateRange", "campaignHours", "comparisonWindow", "primaryMetric"],
    dbtModels: ["fct_dojo_hourly_sales", "dim_calendar_broadcasting", "fct_dojo_transactions_daily"],
    metrics: [
      { name: "Primary Metric Lift", description: "The uplift percentage in the chosen lead metric vs the comparison window", definition: "((campaign_metric - control_metric) / control_metric) * 100" },
      { name: "Revenue Uplift", description: "Incremental sales value directly isolated during campaign window", definition: "sum(campaign_sales_revenue) - control_projection" },
      { name: "Transaction Volume Shift", description: "Change in the total count of approved interactions", definition: "count(campaign_transactions) - control_transactions" },
      { name: "Basket Size Movement", description: "Fluctuation in average transaction tickets during active horas", definition: "campaign_avg_spend - control_avg_spend" },
    ],
  },
  {
    id: AnalysisModuleType.CANNIBALISATION,
    title: "4. Cross-Site Cannibalisation Analysis",
    description: "Assess customer overlap rates and correlation flags across multiple sibling sites in the same territories.",
    requiredParams: ["clientName", "dateRange", "overlapDefinition", "includeVisitFrequency"],
    dbtModels: ["dim_geographic_hex_cells", "dim_dojo_payment_tokens", "fct_loyalty_customer_cohorts"],
    metrics: [
      { name: "Overlap Rate", description: "Percentage of unique customers visiting more than one sibling site in period", definition: "(overlapping_tokens / total_unique_tokens) * 100" },
      { name: "Cannibalisation index correlation", description: "Statistical direction of sales shifts among adjacent geohashes", definition: "correlation_coefficient(site_A_growth, site_B_growth)" },
      { name: "Net Cross-Site Revenue Impact", description: "Estimated aggregate regional incremental revenue vs individual churn", definition: "sum(total_multisite_revenue) - regional_control" },
      { name: "Territory Coverage Share", description: "Territory penetration based on multi-site geohash footprints", definition: "count(covered_hex_cells) / total_regional_cells" },
    ],
  },
];
