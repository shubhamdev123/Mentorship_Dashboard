const mysql = require('mysql2');

// Database connection
const DATABASE_URL = 'mysql://sql12792036:ZBI9jRYB4z@sql12.freesqldatabase.com:3306/sql12792036';

async function addMoreStudents() {
  console.log('Adding More Students to Database...');
  console.log('===================================');
  
  try {
    const connection = mysql.createConnection(DATABASE_URL);
    
    connection.connect((err) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
      }
      
      console.log('✅ Connected to database');
      
      // Add more students (unassigned to mentors initially)
      const additionalStudents = [
        {
          name: 'Ishaan Patel',
          email: 'ishaan.patel@student.edu',
          phone: '+91-9876543212'
        },
        {
          name: 'Priya Sharma',
          email: 'priya.sharma@student.edu',
          phone: '+91-9876543213'
        },
        {
          name: 'Rahul Verma',
          email: 'rahul.verma@student.edu',
          phone: '+91-9876543214'
        },
        {
          name: 'Anjali Singh',
          email: 'anjali.singh@student.edu',
          phone: '+91-9876543215'
        },
        {
          name: 'Vikram Malhotra',
          email: 'vikram.malhotra@student.edu',
          phone: '+91-9876543216'
        },
        {
          name: 'Neha Gupta',
          email: 'neha.gupta@student.edu',
          phone: '+91-9876543217'
        },
        {
          name: 'Arjun Reddy',
          email: 'arjun.reddy@student.edu',
          phone: '+91-9876543218'
        },
        {
          name: 'Zara Khan',
          email: 'zara.khan@student.edu',
          phone: '+91-9876543219'
        },
        {
          name: 'Aditya Joshi',
          email: 'aditya.joshi@student.edu',
          phone: '+91-9876543220'
        },
        {
          name: 'Meera Iyer',
          email: 'meera.iyer@student.edu',
          phone: '+91-9876543221'
        },
        {
          name: 'Karan Mehta',
          email: 'karan.mehta@student.edu',
          phone: '+91-9876543222'
        },
        {
          name: 'Sanya Kapoor',
          email: 'sanya.kapoor@student.edu',
          phone: '+91-9876543223'
        },
        {
          name: 'Rohan Bhatia',
          email: 'rohan.bhatia@student.edu',
          phone: '+91-9876543224'
        },
        {
          name: 'Aisha Rahman',
          email: 'aisha.rahman@student.edu',
          phone: '+91-9876543225'
        },
        {
          name: 'Dev Sharma',
          email: 'dev.sharma@student.edu',
          phone: '+91-9876543226'
        },
        {
          name: 'Kavya Nair',
          email: 'kavya.nair@student.edu',
          phone: '+91-9876543227'
        }
      ];
      
      console.log('\n📝 Adding additional students (unassigned)...');
      
      let addedCount = 0;
      let skippedCount = 0;
      
      additionalStudents.forEach((student, index) => {
        const query = 'INSERT INTO students (name, email, phone) VALUES (?, ?, ?)';
        connection.query(query, [student.name, student.email, student.phone], (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              console.log(`⚠️  Student ${student.name} already exists`);
              skippedCount++;
            } else {
              console.error(`❌ Error adding student ${student.name}:`, err.message);
            }
          } else {
            console.log(`✅ Added student: ${student.name} (ID: ${result.insertId})`);
            addedCount++;
          }
          
          // If this is the last student, show summary
          if (index === additionalStudents.length - 1) {
            setTimeout(() => showSummary(connection, addedCount, skippedCount), 1000);
          }
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function showSummary(connection, addedCount, skippedCount) {
  console.log('\n📊 Additional Students Summary:');
  console.log('================================');
  console.log(`✅ New students added: ${addedCount}`);
  console.log(`⚠️  Students skipped (already exist): ${skippedCount}`);
  
  // Show total students count
  connection.query('SELECT COUNT(*) as total FROM students', (err, result) => {
    if (err) {
      console.error('❌ Error counting total students:', err.message);
    } else {
      console.log(`📊 Total students in database: ${result[0].total}`);
    }
    
    // Show unassigned students
    connection.query('SELECT COUNT(*) as unassigned FROM students WHERE mentor_id IS NULL', (err, result) => {
      if (err) {
        console.error('❌ Error counting unassigned students:', err.message);
      } else {
        console.log(`👥 Unassigned students (available for selection): ${result[0].unassigned}`);
      }
      
      // Show assigned students
      connection.query('SELECT COUNT(*) as assigned FROM students WHERE mentor_id IS NOT NULL', (err, result) => {
        if (err) {
          console.error('❌ Error counting assigned students:', err.message);
        } else {
          console.log(`👨‍🏫 Assigned students: ${result[0].assigned}`);
        }
        
        console.log('\n✅ Additional students insertion completed!');
        console.log('\n🎯 These students are now available in the "Selected Students" section');
        console.log('   for mentors to assign to their mentorship programs.');
        
        connection.end();
      });
    });
  });
}

// Run the script
addMoreStudents();