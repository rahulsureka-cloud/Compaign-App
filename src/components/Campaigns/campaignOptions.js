// Shared option lists for the Create Campaign wizard. Extend these to add new
// channels, categories, priorities, or placement locations (see CLAUDE.md §8).

export const CHANNELS = [
  { value: 'In-app', icon: '📱' },
  { value: 'Email', icon: '✉️' },
  { value: 'SMS', icon: '💬' },
  { value: 'Social media', icon: '📺' },
  { value: 'Ads', icon: '🏷️' },
];

export const PRODUCT_CATEGORIES = ['Savings', 'Checking', 'Credit Card', 'Auto Loan', 'Mortgage'];

export const PRIORITIES = ['High', 'Medium', 'Low'];

export const ASSET_TYPES = ['Image', 'Text', 'HTML'];

export const WEB_LOCATIONS = [
  'Accounts-top banner',
  'Accounts-bottom banner',
  'Dashboard banner',
  'Login screen',
  'Transactions page',
];

export const MOBILE_LOCATIONS = [
  'Accounts-top banner',
  'Accounts-bottom banner',
  'Dashboard banner',
  'Login screen',
  'Transactions page',
];

export const WIZARD_STEPS = ['Setup', 'Segment', 'Location', 'Review'];

// Statuses used across the Campaigns screen tabs and the approval workflow.
export const CAMPAIGN_STATUSES = ['In-progress', 'Under approval', 'Draft', 'Active', 'Completed'];

export const emptyCampaign = () => ({
  name: '',
  description: '',
  keywords: '',
  productCategory: '',
  priority: '',
  startDate: '',
  endDate: '',
  channels: ['In-app'],
  assets: [], // Content step removed from the wizard; assets no longer collected in the UI.
  segmentIds: [],
  manualUploadName: null,
  manualUploadUsers: 0,
  estimatedReach: 0,
  webLocations: [],
  mobileLocations: [],
  status: 'Draft',
  targetedPopulation: 0,
  accepted: 0,
  declined: 0,
  clickedUnfinished: 0,
});
