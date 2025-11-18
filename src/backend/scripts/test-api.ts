/**
 * Simple API test script
 * Tests the main API endpoints to ensure they're working
 */

import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function runTests() {
  log('\n🧪 Starting API Tests\n', 'blue');
  log(`Testing API at: ${API_URL}\n`);

  let authToken = '';
  let userId = '';
  let profileId = '';

  // Test 1: Health Check
  try {
    log('Test 1: Health check...');
    const response = await axios.get(`${API_URL.replace('/api/v1', '')}/health`);
    if (response.data.status === 'healthy') {
      log('✓ Health check passed', 'green');
      results.push({ name: 'Health Check', passed: true });
    } else {
      throw new Error('Health check failed');
    }
  } catch (error: any) {
    log(`✗ Health check failed: ${error.message}`, 'red');
    results.push({ name: 'Health Check', passed: false, error: error.message });
    return; // Can't continue if API is down
  }

  // Test 2: Signup
  try {
    log('\nTest 2: User signup...');
    const testEmail = `test${Date.now()}@example.com`;
    const response = await axios.post(`${API_URL}/auth/signup`, {
      email: testEmail,
      password: 'Test123!@#',
      fullName: 'Test User',
    });

    if (response.data.success && response.data.data.accessToken) {
      authToken = response.data.data.accessToken;
      userId = response.data.data.user.id;
      log(`✓ Signup successful (User ID: ${userId})`, 'green');
      results.push({ name: 'User Signup', passed: true });
    } else {
      throw new Error('No access token returned');
    }
  } catch (error: any) {
    log(`✗ Signup failed: ${error.response?.data?.error || error.message}`, 'red');
    results.push({
      name: 'User Signup',
      passed: false,
      error: error.response?.data?.error || error.message,
    });
    return; // Can't continue without auth
  }

  // Test 3: Get Questionnaire
  try {
    log('\nTest 3: Get questionnaire...');
    const response = await axios.get(`${API_URL}/profiles/questionnaire`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.success && response.data.data.items.length === 40) {
      log(`✓ Questionnaire retrieved (${response.data.data.totalItems} items)`, 'green');
      results.push({ name: 'Get Questionnaire', passed: true });
    } else {
      throw new Error('Invalid questionnaire response');
    }
  } catch (error: any) {
    log(`✗ Get questionnaire failed: ${error.response?.data?.error || error.message}`, 'red');
    results.push({
      name: 'Get Questionnaire',
      passed: false,
      error: error.response?.data?.error || error.message,
    });
  }

  // Test 4: Create Profile
  try {
    log('\nTest 4: Create profile from questionnaire...');

    // Generate random responses (1-5 scale)
    const responses = Array.from({ length: 40 }, (_, i) => ({
      questionId: `${['O', 'C', 'E', 'A', 'N'][Math.floor(i / 8)]}${(i % 8) + 1}`,
      response: Math.floor(Math.random() * 5) + 1,
    }));

    const response = await axios.post(
      `${API_URL}/profiles`,
      { responses },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    if (response.data.success && response.data.data.archetectType) {
      profileId = response.data.data.id;
      log(`✓ Profile created successfully`, 'green');
      log(`  - Archetect Type: ${response.data.data.archetectType}`, 'yellow');
      log(`  - Energy Style: ${response.data.data.energyStyle}`, 'yellow');
      log(`  - Flow Mode: ${response.data.data.flowMode}`, 'yellow');
      log(`  - Season: ${response.data.data.season}`, 'yellow');
      log(`  - Confidence: ${response.data.data.confidenceScore}`, 'yellow');
      results.push({ name: 'Create Profile', passed: true });
    } else {
      throw new Error('Invalid profile response');
    }
  } catch (error: any) {
    log(`✗ Create profile failed: ${error.response?.data?.error || error.message}`, 'red');
    results.push({
      name: 'Create Profile',
      passed: false,
      error: error.response?.data?.error || error.message,
    });
  }

  // Test 5: Get My Profile
  try {
    log('\nTest 5: Get my profile...');
    const response = await axios.get(`${API_URL}/profiles/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.success && response.data.data.id === profileId) {
      log(`✓ Profile retrieved successfully`, 'green');
      results.push({ name: 'Get My Profile', passed: true });
    } else {
      throw new Error('Profile ID mismatch');
    }
  } catch (error: any) {
    log(`✗ Get profile failed: ${error.response?.data?.error || error.message}`, 'red');
    results.push({
      name: 'Get My Profile',
      passed: false,
      error: error.response?.data?.error || error.message,
    });
  }

  // Test 6: Create Second User for Compatibility Test
  let authToken2 = '';
  let profileId2 = '';

  try {
    log('\nTest 6: Create second user for compatibility test...');
    const testEmail2 = `test${Date.now() + 1}@example.com`;
    const signupResponse = await axios.post(`${API_URL}/auth/signup`, {
      email: testEmail2,
      password: 'Test123!@#',
      fullName: 'Test User 2',
    });

    authToken2 = signupResponse.data.data.accessToken;

    // Create profile for second user
    const responses = Array.from({ length: 40 }, (_, i) => ({
      questionId: `${['O', 'C', 'E', 'A', 'N'][Math.floor(i / 8)]}${(i % 8) + 1}`,
      response: Math.floor(Math.random() * 5) + 1,
    }));

    const profileResponse = await axios.post(
      `${API_URL}/profiles`,
      { responses },
      { headers: { Authorization: `Bearer ${authToken2}` } }
    );

    profileId2 = profileResponse.data.data.id;
    log(`✓ Second user and profile created`, 'green');
    results.push({ name: 'Create Second User', passed: true });
  } catch (error: any) {
    log(`✗ Create second user failed: ${error.response?.data?.error || error.message}`, 'red');
    results.push({
      name: 'Create Second User',
      passed: false,
      error: error.response?.data?.error || error.message,
    });
  }

  // Test 7: Calculate Pair Compatibility
  if (profileId && profileId2) {
    try {
      log('\nTest 7: Calculate pair compatibility...');
      const response = await axios.post(
        `${API_URL}/compatibility/pair`,
        {
          profile1Id: profileId,
          profile2Id: profileId2,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data.success && response.data.data.compatibilityScore) {
        log(`✓ Compatibility calculated successfully`, 'green');
        log(`  - Compatibility Score: ${response.data.data.compatibilityScore}`, 'yellow');
        log(`  - Complementarity: ${response.data.data.complementarity}`, 'yellow');
        results.push({ name: 'Pair Compatibility', passed: true });
      } else {
        throw new Error('Invalid compatibility response');
      }
    } catch (error: any) {
      log(`✗ Compatibility calculation failed: ${error.response?.data?.error || error.message}`, 'red');
      results.push({
        name: 'Pair Compatibility',
        passed: false,
        error: error.response?.data?.error || error.message,
      });
    }
  }

  // Test 8: Calculate Team Compatibility
  if (profileId && profileId2) {
    try {
      log('\nTest 8: Calculate team compatibility...');
      const response = await axios.post(
        `${API_URL}/compatibility/team`,
        {
          profileIds: [profileId, profileId2],
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data.success && response.data.data.averageCompatibility) {
        log(`✓ Team compatibility calculated successfully`, 'green');
        log(`  - Average Compatibility: ${response.data.data.averageCompatibility}`, 'yellow');
        log(`  - Team Dynamics: ${response.data.data.teamDynamics}`, 'yellow');
        results.push({ name: 'Team Compatibility', passed: true });
      } else {
        throw new Error('Invalid team compatibility response');
      }
    } catch (error: any) {
      log(`✗ Team compatibility failed: ${error.response?.data?.error || error.message}`, 'red');
      results.push({
        name: 'Team Compatibility',
        passed: false,
        error: error.response?.data?.error || error.message,
      });
    }
  }

  // Print Summary
  log('\n' + '='.repeat(60), 'blue');
  log('TEST SUMMARY', 'blue');
  log('='.repeat(60), 'blue');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  results.forEach((result) => {
    const icon = result.passed ? '✓' : '✗';
    const color = result.passed ? 'green' : 'red';
    log(`${icon} ${result.name}`, color);
    if (result.error) {
      log(`  Error: ${result.error}`, 'red');
    }
  });

  log('\n' + '='.repeat(60), 'blue');
  log(`Total: ${results.length} tests`, 'blue');
  log(`Passed: ${passed}`, 'green');
  if (failed > 0) {
    log(`Failed: ${failed}`, 'red');
  }
  log('='.repeat(60) + '\n', 'blue');

  if (failed === 0) {
    log('🎉 All tests passed!', 'green');
    process.exit(0);
  } else {
    log('❌ Some tests failed', 'red');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  log(`\n❌ Test suite crashed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
