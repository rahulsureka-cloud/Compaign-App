import { countUsers } from '../common/parseUpload';

// ASCII string -> byte array (TextEncoder isn't available in the CRA jsdom env).
const toBytes = (str) => Uint8Array.from(str, (c) => c.charCodeAt(0));

test('counts data rows excluding the header row (CSV)', () => {
  const csv = 'Name,Age,State\nDiana,46,CA\nBruce,53,NJ\nBarry,31,CA\n';
  expect(countUsers(toBytes(csv))).toBe(3);
});

test('matches the bundled dummy-users.csv shape (25 users)', () => {
  const header = 'Name,Age,State,Date of birth';
  const rows = Array.from({ length: 25 }, (_, i) => `User ${i + 1},30,CA,1990-01-01`);
  expect(countUsers(toBytes([header, ...rows].join('\n')))).toBe(25);
});

test('returns 0 for empty or unreadable content', () => {
  expect(countUsers(new Uint8Array())).toBe(0);
});
