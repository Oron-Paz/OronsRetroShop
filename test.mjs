import fetch from 'node-fetch';

const baseUrl = 'http://localhost:3000/api'; // Adjust if needed
let validToken = '';

const login = async () => {
  const loginResponse = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin' })
  });

  if (loginResponse.ok) {
    const cookie = loginResponse.headers.get('set-cookie');
    if (cookie) {
      validToken = cookie.split(';')[0].split('=')[1];
    }
  }
};



const runTests = async () => {
  await login();

  // AUTH/CHECK API TESTS
  const authCheckTest = {
    description: 'Test GET /api/auth/check',
    url: `${baseUrl}/auth/check`,
    method: 'GET',
    headers: {
      Cookie: `token=${validToken}`
    },
    expectedStatus: 200,
  };

  // AUTH/CHECKADMIN API TESTS
  const authCheckAdminNoTokenTest = {
    description: 'Test GET /api/auth/checkAdmin with no token',
    url: `${baseUrl}/auth/checkAdmin`,
    method: 'GET',
    headers: {},
    expectedStatus: 401,
    expectedResponse: { isAdmin: false },
  };

  const authCheckAdminInvalidTokenTest = {
    description: 'Test GET /api/auth/checkAdmin with invalid token',
    url: `${baseUrl}/auth/checkAdmin`,
    method: 'GET',
    headers: {
      Cookie: 'token=invalidToken', 
    },
    expectedStatus: 401,
    expectedResponse: { isAdmin: false },
  };

  // AUTH/LOGIN API TESTS
  const authLoginTest = {
    description: 'Test POST /api/auth/login with valid credentials',
    url: `${baseUrl}/auth/login`,
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password: 'admin', rememberMe: true }),
    headers: { 'Content-Type': 'application/json' },
    expectedStatus: 200,
  };

  const authLoginInvalidCredentialsTest = {
    description: 'Test POST /api/auth/login with invalid credentials',
    url: `${baseUrl}/auth/login`,
    method: 'POST',
    body: JSON.stringify({ username: 'invalid', password: 'invalid' }),
    headers: { 'Content-Type': 'application/json' },
    expectedStatus: 401,
    expectedResponse: { message: 'Invalid credentials' },
  };

  // AUTH/REGISTER API TESTS
  const authRegisterTest = {
    description: 'Test POST /api/auth/register with valid data',
    url: `${baseUrl}/auth/register`,
    method: 'POST',
    body: JSON.stringify({ username: 'newuser2', password: 'password123' }),
    headers: { 'Content-Type': 'application/json' },
    expectedStatus: 201,
  };

  const authRegisterExistingUserTest = {
    description: 'Test POST /api/auth/register with existing username',
    url: `${baseUrl}/auth/register`,
    method: 'POST',
    body: JSON.stringify({ username: 'existinguser', password: 'password123' }),
    headers: { 'Content-Type': 'application/json' },
    expectedStatus: 409,
    expectedResponse: { message: 'Username already exists' },
  };

  // AUTH/SIGNOUT API TESTS
  const authSignoutNoTokenTest = {
    description: 'Test POST /api/auth/signout with no token',
    url: `${baseUrl}/auth/signout`,
    method: 'POST',
    headers: {},
    expectedStatus: 401,
    expectedResponse: { error: 'Not authenticated' },
  };

  const authSignoutInvalidTokenTest = {
    description: 'Test POST /api/auth/signout with invalid token',
    url: `${baseUrl}/auth/signout`,
    method: 'POST',
    headers: {
      Cookie: 'token=invalidToken',
    },
    expectedStatus: 401,
    expectedResponse: { error: 'Invalid token' },
  };

  const authSignoutValidTokenTest = {
    description: 'Test POST /api/auth/signout with valid token',
    url: `${baseUrl}/auth/signout`,
    method: 'POST',
    headers: {
      Cookie: `token=${validToken}`
    },
    expectedStatus: 200,
    expectedResponse: { success: true },
  };

  // JOBS/GET API TESTS
  const jobsGetTest = {
    description: 'Test GET /api/jobs',
    url: `${baseUrl}/jobs`,
    method: 'GET',
    expectedStatus: 200,
  };

  // JOBS/POST API TESTS
  const jobsPostTest = {
    description: 'Test POST /api/jobs with valid data',
    url: `${baseUrl}/jobs`,
    method: 'POST',
    body: JSON.stringify({ title: 'New Job', description: 'Job description' }),
    headers: { 'Content-Type': 'application/json' },
    expectedStatus: 201,
  };

  // JOBS/DELETE API TESTS
  const jobsDeleteTest = {
    description: 'Test DELETE /api/jobs/[id] with valid ID',
    url: `${baseUrl}/jobs/1`, // Adjust ID as needed
    method: 'DELETE',
    expectedStatus: 200,
    expectedResponse: { message: 'Job deleted successfully' },
  };

  // REVIEWS/GET API TESTS
  const reviewsGetTest = {
    description: 'Test GET /api/reviews',
    url: `${baseUrl}/reviews`,
    method: 'GET',
    expectedStatus: 200,
  };

  // REVIEWS/POST API TESTS
  const reviewsPostValidTest = {
    description: 'Test POST /api/reviews with valid data',
    url: `${baseUrl}/reviews`,
    method: 'POST',
    body: JSON.stringify({ message: 'Great job!' }),
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${validToken}`
    },
    expectedStatus: 201,
  };

  const reviewsPostNoTokenTest = {
    description: 'Test POST /api/reviews with no token',
    url: `${baseUrl}/reviews`,
    method: 'POST',
    body: JSON.stringify({ message: 'Great job!' }),
    headers: { 'Content-Type': 'application/json' },
    expectedStatus: 401,
    expectedResponse: { error: 'Not authenticated' },
  };

  // USER/CART/GET API TESTS
  const userCartGetTest = {
    description: 'Test GET /api/user/cart',
    url: `${baseUrl}/user/cart`,
    method: 'GET',
    headers: {
      Cookie: `token=${validToken}`
    },
    expectedStatus: 200,
  };

  // USER/CART/DELETE API TESTS
  const userCartDeleteTest = {
    description: 'Test DELETE /api/user/cart/[itemId] with valid itemId',
    url: `${baseUrl}/user/cart/1`, // Adjust itemId as needed
    method: 'DELETE',
    headers: {
      Cookie: `token=${validToken}`
    },
    expectedStatus: 200,
  };

  // USER/CART/CLEAR API TESTS
  const userCartClearTest = {
    description: 'Test POST /api/user/cart/clear with valid token',
    url: `${baseUrl}/user/cart/clear`,
    method: 'POST',
    headers: {
      Cookie: `token=${validToken}`
    },
    expectedStatus: 200,
    expectedResponse: { message: 'Cart cleared successfully' },
  };

  // USER/PROFILE API TESTS
  const userProfileGetTest = {
    description: 'Test GET /api/user/profile',
    url: `${baseUrl}/user/profile`,
    method: 'GET',
    headers: {
      Cookie: `token=${validToken}`
    },
    expectedStatus: 200,
  };


  const tests = [
    authCheckTest,
    authCheckAdminNoTokenTest,
    authCheckAdminInvalidTokenTest,
    authLoginTest,
    authLoginInvalidCredentialsTest,
    authRegisterTest,
    authRegisterExistingUserTest,
    authSignoutNoTokenTest,
    authSignoutInvalidTokenTest,
    authSignoutValidTokenTest,
    jobsGetTest,
    jobsPostTest,
    jobsDeleteTest,
    reviewsGetTest,
    reviewsPostValidTest,
    reviewsPostNoTokenTest,
    userCartGetTest,
    userCartDeleteTest,
    userCartClearTest,
    userProfileGetTest,
  ];

  for (const test of tests) {
    try {
      const response = await fetch(test.url, {
        method: test.method,
        headers: test.headers,
        body: test.body,
      });

      console.log(`${test.description}: ${response.status === test.expectedStatus ? '\u2705 PASSED' : '\u274c FAILED'}`);

      // Check response body if needed
      if (test.expectedResponse) {
        const responseBody = await response.json();
        const responseMatch = JSON.stringify(responseBody) === JSON.stringify(test.expectedResponse);
        console.log(`Response validation: ${responseMatch ? '\u2705 PASSED' : '\u274c FAILED'}`);
      }
    } catch (error) {
      console.log(`${test.description}: FAILED with error: ${error.message}`);
    }
  }
};

runTests();
