const mysql = require('mysql2');

// Database connection
const DATABASE_URL = 'mysql://sql12792036:ZBI9jRYB4z@sql12.freesqldatabase.com:3306/sql12792036';

async function addDummyData() {
  console.log('Adding Dummy Data to Database...');
  console.log('================================');
  
  try {
    const connection = mysql.createConnection(DATABASE_URL);
    
    connection.connect((err) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
      }
      
      console.log('✅ Connected to database');
      
      // Add mentors
      const mentors = [
        {
          name: 'Dr. Shubham Shrivastav',
          email: 'shubham.dev123int@gmail.com',
          phone: '+91-9876543210'
        },
        {
          name: 'Prof. Shubham Kumar',
          email: 'shubham262608@gmail.com',
          phone: '+91-9876543211'
        },
        {
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@university.edu',
          phone: '+1-555-0123'
        },
        {
          name: 'Prof. Michael Chen',
          email: 'michael.chen@tech.edu',
          phone: '+1-555-0124'
        }
      ];
      
      console.log('\n📝 Adding mentors...');
      
      mentors.forEach((mentor, index) => {
        const query = 'INSERT INTO mentors (name, email, phone) VALUES (?, ?, ?)';
        connection.query(query, [mentor.name, mentor.email, mentor.phone], (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              console.log(`⚠️  Mentor ${mentor.name} already exists`);
            } else {
              console.error(`❌ Error adding mentor ${mentor.name}:`, err.message);
            }
          } else {
            console.log(`✅ Added mentor: ${mentor.name} (ID: ${result.insertId})`);
          }
          
          // If this is the last mentor, add students
          if (index === mentors.length - 1) {
            setTimeout(() => addStudents(connection), 1000);
          }
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function addStudents(connection) {
  console.log('\n📝 Adding students...');
  
  const students = [
    {
      name: 'Alice Smith',
      email: 'alice.smith@student.edu',
      phone: '+1-555-1001',
      mentor_id: 1
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@student.edu',
      phone: '+1-555-1002',
      mentor_id: 1
    },
    {
      name: 'Carol Davis',
      email: 'carol.davis@student.edu',
      phone: '+1-555-1003',
      mentor_id: 2
    },
    {
      name: 'David Wilson',
      email: 'david.wilson@student.edu',
      phone: '+1-555-1004',
      mentor_id: 2
    },
    {
      name: 'Eva Brown',
      email: 'eva.brown@student.edu',
      phone: '+1-555-1005',
      mentor_id: 3
    },
    {
      name: 'Frank Miller',
      email: 'frank.miller@student.edu',
      phone: '+1-555-1006',
      mentor_id: 3
    },
    {
      name: 'Grace Lee',
      email: 'grace.lee@student.edu',
      phone: '+1-555-1007',
      mentor_id: 4
    },
    {
      name: 'Henry Taylor',
      email: 'henry.taylor@student.edu',
      phone: '+1-555-1008',
      mentor_id: 4
    }
  ];
  
  students.forEach((student, index) => {
    const query = 'INSERT INTO students (name, email, phone, mentor_id) VALUES (?, ?, ?, ?)';
    connection.query(query, [student.name, student.email, student.phone, student.mentor_id], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Student ${student.name} already exists`);
        } else {
          console.error(`❌ Error adding student ${student.name}:`, err.message);
        }
      } else {
        console.log(`✅ Added student: ${student.name} (ID: ${result.insertId})`);
      }
      
      // If this is the last student, add some marks
      if (index === students.length - 1) {
        setTimeout(() => addMarks(connection), 1000);
      }
    });
  });
}

function addMarks(connection) {
  console.log('\n📝 Adding student marks...');
  
  // Add marks for first 4 students
  const marks = [
    { student_id: 1, idea_marks: 85, execution_marks: 90, presentation_marks: 88, communication_marks: 92, total_marks: 355 },
    { student_id: 2, idea_marks: 78, execution_marks: 85, presentation_marks: 82, communication_marks: 80, total_marks: 325 },
    { student_id: 3, idea_marks: 92, execution_marks: 88, presentation_marks: 95, communication_marks: 90, total_marks: 365 },
    { student_id: 4, idea_marks: 75, execution_marks: 80, presentation_marks: 78, communication_marks: 85, total_marks: 318 }
  ];
  
  marks.forEach((mark, index) => {
    const query = 'INSERT INTO student_marks (student_id, idea_marks, execution_marks, presentation_marks, communication_marks, total_marks) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [mark.student_id, mark.idea_marks, mark.execution_marks, mark.presentation_marks, mark.communication_marks, mark.total_marks], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Marks for student ${mark.student_id} already exist`);
        } else {
          console.error(`❌ Error adding marks for student ${mark.student_id}:`, err.message);
        }
      } else {
        console.log(`✅ Added marks for student ${mark.student_id} (Total: ${mark.total_marks})`);
      }
      
      // If this is the last mark, show summary
      if (index === marks.length - 1) {
        setTimeout(() => showSummary(connection), 1000);
      }
    });
  });
}

function showSummary(connection) {
  console.log('\n📊 Database Summary:');
  console.log('===================');
  
  // Count mentors
  connection.query('SELECT COUNT(*) as count FROM mentors', (err, result) => {
    if (err) {
      console.error('❌ Error counting mentors:', err.message);
    } else {
      console.log(`👨‍🏫 Total Mentors: ${result[0].count}`);
    }
    
    // Count students
    connection.query('SELECT COUNT(*) as count FROM students', (err, result) => {
      if (err) {
        console.error('❌ Error counting students:', err.message);
      } else {
        console.log(`👨‍🎓 Total Students: ${result[0].count}`);
      }
      
      // Count marks
      connection.query('SELECT COUNT(*) as count FROM student_marks', (err, result) => {
        if (err) {
          console.error('❌ Error counting marks:', err.message);
        } else {
          console.log(`📝 Total Student Marks: ${result[0].count}`);
        }
        
        console.log('\n✅ Dummy data insertion completed!');
        connection.end();
      });
    });
  });
}

// Run the script
addDummyData();