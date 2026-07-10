import { estimateSegmentReach, combineAudienceReach } from '../UserSegment/segmentOptions';

// These expected values mirror the backend SegmentService.EstimateReach formula.
describe('estimateSegmentReach', () => {
  test('no rules -> base population', () => {
    expect(estimateSegmentReach({ rules: [], matchLogic: 'AND' })).toBe(100000);
  });
  test('one AND rule -> 45,000', () => {
    expect(estimateSegmentReach({ rules: [{}], matchLogic: 'AND' })).toBe(45000);
  });
  test('two AND rules -> 20,250', () => {
    expect(estimateSegmentReach({ rules: [{}, {}], matchLogic: 'AND' })).toBe(20250);
  });
  test('one OR rule -> 70,000', () => {
    expect(estimateSegmentReach({ rules: [{}], matchLogic: 'OR' })).toBe(70000);
  });
});

describe('combineAudienceReach', () => {
  test('sums segment reaches + manual users, applies 0.9 dedup', () => {
    expect(combineAudienceReach({ segmentReaches: [45000, 8420], manualUsers: 0 })).toBe(48078);
  });
  test('manual users only', () => {
    expect(combineAudienceReach({ segmentReaches: [], manualUsers: 100 })).toBe(90);
  });
});
