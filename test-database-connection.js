const mysql = require('mysql2');

// Test database connection
async function testDatabaseConnection() {
  console.log('Testing Database Connection...');
  console.log('==============================');
  
  const DATABASE_URL = 'mysql://sql12792036:ZBI9jRYB4z@sql12.freesqldatabase.com:3306/sql12792036';
  
  console.log('DATABASE_URL:', DATABASE_URL);
  console.log('');
  
  try {
    console.log('Creating connection...');
    const connection = mysql.createConnection(DATABASE_URL);
    
    console.log('Attempting to connect...');
    
    connection.connect((err) => {
      if (err) {
        console.error('❌ Database connection failed:');
        console.error('Error:', err.message);
        console.error('Code:', err.code);
        console.error('Errno:', err.errno);
        console.error('SQLState:', err.sqlState);
        return;
      }
      
      console.log('✅ Database connection successful!');
      
      // Test a simple query
      connection.query('SELECT 1 as test', (err, results) => {
        if (err) {
          console.error('❌ Query failed:', err.message);
        } else {
          console.log('✅ Query successful:', results);
        }
        
        // Test if tables exist
        connection.query('SHOW TABLES', (err, results) => {
          if (err) {
            console.error('❌ SHOW TABLES failed:', err.message);
          } else {
            console.log('✅ Tables in database:', results);
          }
          
          connection.end();
          console.log('Connection closed.');
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Error creating connection:', error.message);
  }
}

// Run the test
testDatabaseConnection();