const mysql = require('mysql2');

// Test production API and database
async function testProductionAPI() {
  console.log('Testing Production API and Database...');
  console.log('======================================');
  
  const DATABASE_URL = 'mysql://sql12792036:ZBI9jRYB4z@sql12.freesqldatabase.com:3306/sql12792036';
  
  try {
    const connection = mysql.createConnection(DATABASE_URL);
    
    connection.connect((err) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
      }
      
      console.log('✅ Database connection successful');
      
      // Test getting all students
      console.log('\n📝 Testing student data retrieval...');
      const query = 'SELECT * FROM students ORDER BY id';
      
      connection.query(query, (err, results) => {
        if (err) {
          console.error('❌ Error fetching students:', err.message);
        } else {
          console.log(`✅ Found ${results.length} students in database`);
          
          // Show first few students
          console.log('\n📊 Sample students:');
          results.slice(0, 5).forEach((student, index) => {
            console.log(`${index + 1}. ${student.name} (${student.email}) - Mentor ID: ${student.mentor_id || 'Unassigned'}`);
          });
          
          if (results.length > 5) {
            console.log(`... and ${results.length - 5} more students`);
          }
        }
        
        // Test getting unassigned students
        console.log('\n👥 Testing unassigned students...');
        const unassignedQuery = 'SELECT * FROM students WHERE mentor_id IS NULL';
        
        connection.query(unassignedQuery, (err, results) => {
          if (err) {
            console.error('❌ Error fetching unassigned students:', err.message);
            return;
          }
          
          console.log(`✅ Found ${results.length} unassigned students`);
          
          if (results.length > 0) {
            console.log('\n📋 Unassigned students available for selection:');
            results.forEach((student, index) => {
              console.log(`${index + 1}. ${student.name} (${student.email})`);
            });
          }
          
          // Test getting mentors
          console.log('\n👨‍🏫 Testing mentor data...');
          const mentorQuery = 'SELECT * FROM mentors ORDER BY id';
          
          connection.query(mentorQuery, (err, results) => {
            if (err) {
              console.error('❌ Error fetching mentors:', err.message);
              return;
            }
            
            console.log(`✅ Found ${results.length} mentors in database`);
            
            console.log('\n📊 Mentors:');
            results.forEach((mentor, index) => {
              console.log(`${index + 1}. ${mentor.name} (${mentor.email})`);
            });
            
            connection.end();
            console.log('\n✅ Database test completed successfully!');
            console.log('\n🔧 The issue is that the API routes are not working in production.');
            console.log('   The database has all the data, but the web app cannot access it.');
          });
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testProductionAPI();