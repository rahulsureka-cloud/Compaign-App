// Single source of truth for the User Segment domain — shared by the segment
// builder (AddUserSegment), the segment list (UserSegmentList), and the campaign
// wizard's segment picker (SegmentPickerModal). Mirrors campaignOptions.js so the
// two features stay in sync (see the sync plan / CLAUDE.md).

export const CRITERIA = ['Age', 'State', 'Gender', 'Income', 'Account type'];

export const OPERATORS = ['is', 'is not', 'Greater than', 'Less than', 'Contains'];

export const MATCH_LOGIC = [
  { value: 'AND', label: 'Match ALL criteria (AND)' },
  { value: 'OR', label: 'Match ANY criteria (OR)' },
];

export const newRule = () => ({ criteria: 'Age', operator: 'Greater than', value: '' });

/**
 * Human-readable one-line description of a segment's rules, e.g.
 * "Age Greater than 25 AND State is CA". Used identically everywhere a segment
 * is displayed so the wording never drifts between screens.
 */
export const describeRules = (segment) =>
  (segment.rules || [])
    .map((r) => `${r.criteria} ${r.operator} ${r.value}`)
    .join(` ${segment.matchLogic} `);

// --- Reach estimation (mirrors backend SegmentService.EstimateReach; POC heuristic) ---
export const REACH_BASE_POPULATION = 100000;
export const REACH_FACTOR = { AND: 0.45, OR: 0.70 };
export const AUDIENCE_DEDUP_FACTOR = 0.9;

/**
 * Rules-based reach estimate for a single segment. Matches the backend exactly
 * so the number previewed while building a segment equals the stored value.
 */
export function estimateSegmentReach(segment) {
  const rules = segment.rules || [];
  if (rules.length === 0) return REACH_BASE_POPULATION;
  const factor = segment.matchLogic === 'AND' ? REACH_FACTOR.AND : REACH_FACTOR.OR;
  return Math.round(REACH_BASE_POPULATION * Math.pow(factor, rules.length));
}

/**
 * Combined audience reach for a campaign: selected segments' reach plus any
 * manually uploaded users, reduced by a shared dedup factor. Used by the wizard.
 */
export function combineAudienceReach({ segmentReaches = [], manualUsers = 0 }) {
  const total = segmentReaches.reduce((sum, n) => sum + (n || 0), 0) + manualUsers;
  return Math.round(total * AUDIENCE_DEDUP_FACTOR);
}
