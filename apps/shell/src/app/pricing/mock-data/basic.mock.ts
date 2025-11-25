// Mock data for Basic pricing plans
export interface BasicPricingPlanData {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
}

export const BASIC_PRICING_PLANS: BasicPricingPlanData[] = [
  {
    name: 'Basic',
    description: 'Start with essential tools to boost your online presence.',
    monthlyPrice: 49,
    annualPrice: 299,
    features: [
      'SEO Strategy & Topic Recommendations',
      'Competitor Analysis to stand out',
      'Built-in Keyword Research',
      'Target latest Google trends',
      'SEO optimized blogs and socials',
      'Technical SEO analysis and Reports',
      'Target 100+ regions and languages',
    ],
  },
  {
    name: 'Professional',
    description: 'Unlock enhanced features and premium content to supercharge your business.',
    monthlyPrice: 199,
    annualPrice: 990,
    features: [
      'Everything in Basic plan',
      'Get 25 premium blogs',
      'Index upto 1000 pages',
      'Premium support',
      'Local SEO',
      'SEO Agent',
    ],
  },
  {
    name: 'Premium',
    description: 'Ultimate customization and dedicated support for enterprises.',
    monthlyPrice: 1499,
    annualPrice: 5990,
    features: [
      'Everything in Professional plan',
      'Get Unlimited premium blogs',
      'Add your own AI Model key',
      'Premium support & training sessions',
    ],
  },
];
