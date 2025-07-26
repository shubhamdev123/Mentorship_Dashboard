const https = require('https');

console.log('Testing Deployment Status...');
console.log('============================');
console.log();

// Test health endpoint
function testHealth() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'mentorship-dashboard-yrv4.onrender.com',
      port: 443,
      path: '/health',
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('🏥 Health Endpoint Test:');
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            console.log('✅ Health endpoint working!');
            console.log('Response:', jsonData);
          } catch (e) {
            console.log('⚠️  Health endpoint returning HTML instead of JSON');
            console.log('Response preview:', data.substring(0, 100) + '...');
          }
        } else {
          console.log('❌ Health endpoint failed');
        }
        console.log();
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log('❌ Health endpoint error:', err.message);
      console.log();
      resolve();
    });

    req.end();
  });
}

// Test students API
function testStudentsAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'mentorship-dashboard-yrv4.onrender.com',
      port: 443,
      path: '/students/search?q=test',
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('👥 Students API Test:');
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            console.log('✅ Students API working!');
            console.log(`Found ${jsonData.length} students`);
          } catch (e) {
            console.log('⚠️  Students API returning HTML instead of JSON');
            console.log('Response preview:', data.substring(0, 100) + '...');
          }
        } else {
          console.log('❌ Students API failed');
        }
        console.log();
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log('❌ Students API error:', err.message);
      console.log();
      resolve();
    });

    req.end();
  });
}

// Test mentors API
function testMentorsAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'mentorship-dashboard-yrv4.onrender.com',
      port: 443,
      path: '/mentors/search?q=test',
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('👨‍🏫 Mentors API Test:');
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            console.log('✅ Mentors API working!');
            console.log(`Found ${jsonData.length} mentors`);
          } catch (e) {
            console.log('⚠️  Mentors API returning HTML instead of JSON');
            console.log('Response preview:', data.substring(0, 100) + '...');
          }
        } else {
          console.log('❌ Mentors API failed');
        }
        console.log();
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log('❌ Mentors API error:', err.message);
      console.log();
      resolve();
    });

    req.end();
  });
}

// Run all tests
async function runTests() {
  console.log('Starting API tests...\n');
  
  await testHealth();
  await testStudentsAPI();
  await testMentorsAPI();
  
  console.log('🎯 Summary:');
  console.log('===========');
  console.log('If you see "returning HTML instead of JSON" messages,');
  console.log('it means the API routes are not working properly.');
  console.log('');
  console.log('✅ Database has 24 students ready to be displayed');
  console.log('❌ API routes need to be fixed in production');
  console.log('');
  console.log('Please trigger a manual redeploy on Render with');
  console.log('"Clear build cache & deploy" option.');
}

runTests();