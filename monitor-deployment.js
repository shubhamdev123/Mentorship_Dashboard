const https = require('https');

console.log('🔍 Monitoring Deployment Status...');
console.log('==================================');
console.log();

let testCount = 0;
const maxTests = 10; // Test for 5 minutes (every 30 seconds)

function testEndpoints() {
  testCount++;
  console.log(`\n📊 Test #${testCount} - ${new Date().toLocaleTimeString()}`);
  console.log('=====================================');
  
  // Test health endpoint
  testHealth().then(() => {
    // Test students API
    return testStudentsAPI();
  }).then(() => {
    // Test mentors API
    return testMentorsAPI();
  }).then(() => {
    console.log('\n✅ All tests completed for this round');
    
    if (testCount < maxTests) {
      console.log(`\n⏳ Waiting 30 seconds before next test...`);
      setTimeout(testEndpoints, 30000);
    } else {
      console.log('\n🎯 Monitoring complete!');
      console.log('If API routes are still not working, please trigger a manual redeploy.');
    }
  });
}

function testHealth() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'mentorship-dashboard-yrv4.onrender.com',
      port: 443,
      path: '/health',
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('🏥 Health:', res.statusCode === 200 ? '✅' : '❌');
        if (res.statusCode === 200) {
          try {
            JSON.parse(data);
            console.log('   JSON response: ✅');
          } catch (e) {
            console.log('   HTML response: ❌');
          }
        }
        resolve();
      });
    });

    req.on('error', () => {
      console.log('🏥 Health: ❌ Connection failed');
      resolve();
    });

    req.end();
  });
}

function testStudentsAPI() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'mentorship-dashboard-yrv4.onrender.com',
      port: 443,
      path: '/students/test',
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('👥 Students API:', res.statusCode === 200 ? '✅' : '❌');
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log('   Response:', json.message || 'Working');
          } catch (e) {
            console.log('   HTML response: ❌');
          }
        }
        resolve();
      });
    });

    req.on('error', () => {
      console.log('👥 Students API: ❌ Connection failed');
      resolve();
    });

    req.end();
  });
}

function testMentorsAPI() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'mentorship-dashboard-yrv4.onrender.com',
      port: 443,
      path: '/mentors/test',
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('👨‍🏫 Mentors API:', res.statusCode === 200 ? '✅' : '❌');
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log('   Response:', json.message || 'Working');
          } catch (e) {
            console.log('   HTML response: ❌');
          }
        }
        resolve();
      });
    });

    req.on('error', () => {
      console.log('👨‍🏫 Mentors API: ❌ Connection failed');
      resolve();
    });

    req.end();
  });
}

// Start monitoring
console.log('🚀 Starting deployment monitoring...');
console.log('This will test the API endpoints every 30 seconds for 5 minutes.');
console.log('Press Ctrl+C to stop monitoring early.\n');

testEndpoints();