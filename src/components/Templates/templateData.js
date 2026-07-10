// Reusable campaign blueprints. "Use template" seeds the wizard with these.
export const TEMPLATES = [
  {
    key: 'savings-promo',
    title: 'New Savings Account Promo',
    summary: 'Promote a high-yield savings account to existing checking customers.',
    campaign: {
      name: 'New Savings Account Promo',
      description: 'Promote our high-yield savings account to existing customers.',
      keywords: 'savings, high-yield, deposit',
      productCategory: 'Savings',
      priority: 'High',
      channels: ['In-app', 'Email'],
    },
  },
  {
    key: 'credit-card-cross-sell',
    title: 'Credit Card Cross-Sell',
    summary: 'Offer a rewards credit card to customers with an existing account relationship.',
    campaign: {
      name: 'Credit Card Cross-Sell',
      description: 'Cross-sell our rewards credit card to eligible existing customers.',
      keywords: 'credit card, rewards, cross-sell',
      productCategory: 'Credit Card',
      priority: 'Medium',
      channels: ['In-app', 'Email', 'SMS'],
    },
  },
  {
    key: 'mortgage-rate-alert',
    title: 'Mortgage Rate Alert',
    summary: 'Alert prospective borrowers about competitive mortgage rates.',
    campaign: {
      name: 'Mortgage Rate Alert',
      description: 'Notify customers about our latest competitive mortgage rates.',
      keywords: 'mortgage, rates, refinance',
      productCategory: 'Mortgage',
      priority: 'High',
      channels: ['Email', 'SMS'],
    },
  },
  {
    key: 'auto-loan-offer',
    title: 'Auto Loan Offer',
    summary: 'Present a low-rate auto loan offer to customers shopping for a vehicle.',
    campaign: {
      name: 'Auto Loan Offer',
      description: 'Promote our low-rate auto loan offer to prospective buyers.',
      keywords: 'auto loan, financing, vehicle',
      productCategory: 'Auto Loan',
      priority: 'Medium',
      channels: ['In-app', 'Ads'],
    },
  },
];
