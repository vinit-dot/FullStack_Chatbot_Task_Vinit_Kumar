// Smoke test for everything that does NOT need a database:
// validation, admin auth, invalid IDs, JSON errors, 404. Run: npm test
process.env.ADMIN_API_KEY = 'test-admin-key-123456';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
const assert = require('assert');
const app = require('../app');

const server = app.listen(0, async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, opts);
    return { status: res.status, body: await res.json() };
  };
  const json = (method, body, headers = {}) => ({
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const admin = { 'x-admin-key': process.env.ADMIN_API_KEY };
  let passed = 0;
  const check = (name, cond) => { assert.ok(cond, name); passed++; console.log('PASS', name); };

  try {
    let r = await call('/api/health');
    check('health 200', r.status === 200);

    r = await call('/api/enquiries', json('POST', {}));
    check('empty POST -> 400 with field errors', r.status === 400 && r.body.errors.name && r.body.errors.email && r.body.errors.phone);

    r = await call('/api/enquiries', json('POST', { name: 'Vinit', email: 'bad-email', phone: '12', userType: 'Hacker', interest: 'x', message: 'hello there' }));
    check('bad email/phone/userType -> 400', r.status === 400 && r.body.errors.email && r.body.errors.phone && r.body.errors.userType);

    r = await call('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad json' });
    check('malformed JSON -> 400', r.status === 400);

    r = await call('/api/enquiries');
    check('GET without admin key -> 401', r.status === 401);

    r = await call('/api/enquiries', { headers: { 'x-admin-key': 'wrong' } });
    check('GET with wrong key -> 401', r.status === 401);

    r = await call('/api/enquiries/not-an-id', { headers: admin });
    check('invalid ID -> 400', r.status === 400);

    r = await call('/api/enquiries/not-an-id', { method: 'DELETE', headers: admin });
    check('DELETE invalid ID -> 400', r.status === 400);

    r = await call('/api/enquiries/64b7f0f4f4d3a2b1c8e4a111', json('PATCH', { status: 'Done' }, admin));
    check('PATCH invalid status -> 400', r.status === 400);

    r = await call('/api/nothing-here');
    check('unknown route -> 404', r.status === 404);

    const bad = await fetch(base + '/api/health', { headers: { Origin: 'http://evil.example' } });
    check('CORS blocks unknown origin', bad.status === 403);

    const { validateEnquiry } = require('../utils/validation');
    const v = validateEnquiry({ name: '<script>alert(1)</script>Vinit', email: 'A@B.com', phone: '+91 98765-43210', userType: 'Student', interest: 'Drone Pilot Training', message: 'Hello <b>team</b>' });
    check('HTML tags stripped, valid body passes', !Object.keys(v.errors).length && v.values.name === 'alert(1)Vinit' && v.values.message === 'Hello team' && v.values.email === 'a@b.com');

    console.log(`\nAll ${passed} checks passed`);
  } catch (e) {
    console.error('FAILED:', e.message);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
