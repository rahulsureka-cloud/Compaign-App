import { logAudit, getAuditLog, clearAuditLog, ensureAuditSeed } from '../../services/audit';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

test('logAudit appends an entry (newest first) with the passed user', () => {
  logAudit('Login', 'Signed in', { username: 'admin', name: 'Administrator', role: 'admin' });
  logAudit('Approve campaign', 'Alpha', { username: 'admin', name: 'Administrator', role: 'admin' });
  const log = getAuditLog();
  expect(log).toHaveLength(2);
  expect(log[0].action).toBe('Approve campaign'); // newest first
  expect(log[0].details).toBe('Alpha');
  expect(log[1].action).toBe('Login');
  expect(log[0].name).toBe('Administrator');
  expect(log[0].timestamp).toBeTruthy();
});

test('logAudit falls back to the signed-in user from sessionStorage', () => {
  sessionStorage.setItem('mcm.auth.user', JSON.stringify({ username: 'creator', name: 'Campaign Creator', role: 'creator' }));
  logAudit('Create campaign', 'My Camp');
  const [entry] = getAuditLog();
  expect(entry.username).toBe('creator');
  expect(entry.role).toBe('creator');
});

test('clearAuditLog empties the log', () => {
  logAudit('Login', 'Signed in', { username: 'admin', name: 'Administrator', role: 'admin' });
  clearAuditLog();
  expect(getAuditLog()).toHaveLength(0);
});

test('ensureAuditSeed seeds sample entries only when empty', () => {
  ensureAuditSeed();
  const seeded = getAuditLog();
  expect(seeded.length).toBeGreaterThan(0);
  // Running again does not duplicate/overwrite.
  ensureAuditSeed();
  expect(getAuditLog()).toHaveLength(seeded.length);
});

test('clearAuditLog is sticky — ensureAuditSeed will not re-seed afterwards', () => {
  ensureAuditSeed();
  expect(getAuditLog().length).toBeGreaterThan(0);
  clearAuditLog();
  expect(getAuditLog()).toHaveLength(0);
  // A subsequent refresh/seed attempt must NOT bring the sample data back.
  ensureAuditSeed();
  expect(getAuditLog()).toHaveLength(0);
});
