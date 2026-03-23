const http = require('http');

const PORT = 8000;
const BASE_URL = `http://localhost:${PORT}/api`;

async function makeRequest(method, endpoint, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + endpoint);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING VERIFICATION TESTS ---\n');
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'password123';
  let patientToken = '';
  
  // Test 1: Privilege Escalation (Try to register as admin)
  console.log('Test 1: Registering user with requested role "admin"...');
  const regRes = await makeRequest('POST', '/auth/register', {
    first_name: 'Hacker',
    last_name: 'Test',
    email: testEmail,
    password: testPassword,
    role: 'admin' // Attempting privilege escalation
  });
  console.log(`Status: ${regRes.status}`);
  if (regRes.status !== 201) console.log(regRes.data);

  // Test 2: Login to check actual role assigned
  console.log('\nTest 2: Logging in to check actual role...');
  const loginRes = await makeRequest('POST', '/auth/login', {
    email: testEmail,
    password: testPassword
  });
  console.log(`Status: ${loginRes.status}`);
  if (loginRes.data.access) {
      patientToken = loginRes.data.access;
      const base64Url = patientToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
      console.log(`Actual assigned role: ${payload.role}`);
      if (payload.role === 'patient') {
          console.log('✅ PASS: Privilege escalation blocked. User forced to "patient" role.');
      } else {
          console.log('❌ FAIL: User was able to set their own role!');
      }
  } else {
      console.log('Login failed: ', loginRes.data);
  }

  // Test 3: Unauthenticated Access
  console.log('\nTest 3: Accessing protected route without token...');
  const unauthRes = await makeRequest('GET', '/doctors');
  console.log(`Status: ${unauthRes.status}`);
  if (unauthRes.status === 401) {
      console.log('✅ PASS: Unauthenticated access blocked (401).');
  } else {
      console.log(`❌ FAIL: Expected 401, got ${unauthRes.status}`);
  }

  // Test 4: Role-Based Access Control (Patient trying to access Receptionist route)
  console.log('\nTest 4: Patient attempting to access Receptionist/Admin route (/api/doctors)...');
  const rbacRes = await makeRequest('GET', '/doctors', null, patientToken);
  console.log(`Status: ${rbacRes.status}`);
  if (rbacRes.status === 403) {
      console.log('✅ PASS: Role-based access control working. Patient denied access (403).');
      console.log('Message:', rbacRes.data.detail);
  } else {
      console.log(`❌ FAIL: Expected 403 forbidden, got ${rbacRes.status}`);
  }

  // Test 5: Role-Based Access Control (Patient trying to create a doctor)
  console.log('\nTest 5: Patient attempting to access Admin route (POST /api/doctors)...');
  const rbacAdminRes = await makeRequest('POST', '/doctors', { first_name: "Fake" }, patientToken);
  console.log(`Status: ${rbacAdminRes.status}`);
  if (rbacAdminRes.status === 403) {
      console.log('✅ PASS: Role-based access control working. Patient denied admin action (403).');
  } else {
      console.log(`❌ FAIL: Expected 403 forbidden, got ${rbacAdminRes.status}`);
  }
  
  // Test 6: Valid Patient Access
  console.log('\nTest 6: Patient accessing allowed patient route (GET /api/patients/me)...');
  const validRes = await makeRequest('GET', '/patients/me', null, patientToken);
  console.log(`Status: ${validRes.status}`);
  if (validRes.status === 200) {
      console.log('✅ PASS: Patient can access their own profile (200).');
  } else {
      console.log(`❌ FAIL: Expected 200, got ${validRes.status}`);
  }

  console.log('\n--- VERIFICATION TESTS COMPLETE ---');
}

runTests().catch(console.error);
