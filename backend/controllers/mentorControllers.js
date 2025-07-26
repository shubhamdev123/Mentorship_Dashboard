const db = require("../config/db");

// Controller for searching mentors
const searchMentor = (req, res) => {
  const searchQuery = req.query.q.toLowerCase();

  const searchMentorQuery = `SELECT * FROM mentors WHERE LOWER(name) LIKE '%${searchQuery}%' OR LOWER(email) LIKE '%${searchQuery}%'`;

  db.query(searchMentorQuery, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }

    const rows = result?.rows || result;
    res.status(200).send(rows);
  });
};

// Controller for getting assigned students for a mentor
const getAssignedStudents = (req, res) => {
  const mentorId = req.params.mentorId;

  // First, check if the mentor exists
  const checkMentorQuery = `SELECT * FROM mentors WHERE id = $1`;
  db.query(checkMentorQuery, [mentorId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }

    const rows = result?.rows || result;
    // If the mentor doesn't exist, send a 404 error
    if (rows.length === 0) {
      res.status(404).send("Mentor not able to find");
      return;
    }

    // If the mentor exists, get all the students assigned to them along with their marks
    const getStudentsQuery = `
      SELECT students.id, students.name, students.email, students.phone, students.evaluated_by, student_marks.idea_marks, student_marks.execution_marks, student_marks.presentation_marks, student_marks.communication_marks, student_marks.total_marks
      FROM students
      LEFT JOIN student_marks ON students.id = student_marks.student_id
      WHERE students.mentor_id = $1
    `;
    db.query(getStudentsQuery, [mentorId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      const rows = result?.rows || result;
      // Return the list of students and their marks
      res.status(200).send(rows);
    });
  });
};

// Controller for assigning students to a mentor
const assignStudent = (req, res) => {
  const { mentorId, studentIds } = req.body;

  // Check if the mentor exists in the database
  const getMentorQuery = `SELECT * FROM mentors WHERE id = $1`;
  db.query(getMentorQuery, [mentorId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal server error");
    }

    const rows = result?.rows || result;
    if (rows.length === 0) {
      return res.status(404).send(`Mentor with ID ${mentorId} not found`);
    }

    // Check if the mentor already has 4 students assigned
    const countStudentsQuery = `SELECT COUNT(*) as count FROM students WHERE mentor_id = $1`;
    db.query(countStudentsQuery, [mentorId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
      }

      const rows = result?.rows || result;
      let { count } = rows[0];
      if (count > 3) {
        return res.status(400).send("Mentor already has 4 students assigned");
      }

      // Check if the students already have a mentor assigned
      const placeholders = studentIds.map((_, i) => `$${i + 1}`).join(',');
      const getStudentsQuery = `SELECT * FROM students WHERE id IN (${placeholders}) AND mentor_id IS NOT NULL`;
      db.query(getStudentsQuery, studentIds, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal server error");
        }

        const rows = result?.rows || result;
        if (rows.length > 0) {
          return res
            .status(400)
            .send("One or more students already have a mentor assigned");
        }

        // Check if the students have already been evaluated
        const getEvaluatedStudentsQuery = `SELECT * FROM students WHERE id IN (${placeholders}) AND evaluated_by IS NOT NULL`;
        db.query(getEvaluatedStudentsQuery, studentIds, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal server error");
          }

          const rows = result?.rows || result;
          if (rows.length > 0) {
            return res
              .status(400)
              .send("One or more students have already been evaluated");
          }

          // Check if number of students to be assigned + number of already assigned students > 4
          if(studentIds.length + count > 4){
            return res
              .status(400)
              .send("Total students are greater than 4");
          }

          // Assign the students to the mentor
          const assignStudentsQuery = `UPDATE students SET mentor_id = $1 WHERE id IN (${placeholders})`;
          db.query(assignStudentsQuery, [mentorId, ...studentIds], (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Internal server error");
            }

            return res
              .status(200)
              .send("Students assigned to mentor successfully");
          });
        });
      });
    });
  });
};

// Controller for unassigning a student from a mentor
const unassignStudent = (req, res) => {
  const mentorId = req.params.mentorId;
  const studentId = req.params.studentId;

  // First, check if the mentor exists
  const checkMentorQuery = `SELECT * FROM mentors WHERE id = $1`;
  db.query(checkMentorQuery, [mentorId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }

    const rows = result?.rows || result;
    // If the mentor doesn't exist, send a 404 error
    if (rows.length === 0) {
      res.status(404).send("Mentor not found");
      return;
    }

    // If the mentor exists, check if the student is assigned to them
    const checkStudentQuery = `SELECT * FROM students WHERE id = $1 AND mentor_id = $2`;
    db.query(checkStudentQuery, [studentId, mentorId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      const rows = result?.rows || result;
      // If the student is not assigned to the mentor, send a 404 error
      if (rows.length === 0) {
        res.status(404).send("Student not assigned to this mentor");
        return;
      }

      // Remove the student from the mentor's list of assigned students
      const removeStudentQuery = `UPDATE students SET mentor_id = NULL WHERE id = $1`;
      db.query(removeStudentQuery, [studentId], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }

        res.status(200).send("Student successfully removed from mentor");
      });
    });
  });
};

// Controller for marking a student's evaluation criteria
const markStudent = (req, res) => {
  const mentorId = req.params.mentorId;
  const studentId = req.params.studentId;
  const {
    idea_marks,
    execution_marks,
    presentation_marks,
    communication_marks,
  } = req.body;

  // First, check if the mentor exists
  const checkMentorQuery = `SELECT * FROM mentors WHERE id = $1`;
  db.query(checkMentorQuery, [mentorId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }

    const rows = result?.rows || result;
    // If the mentor doesn't exist, send a 404 error
    if (rows.length === 0) {
      res.status(404).send("Mentor not found");
      return;
    }

    // If the mentor exists, check if the student is assigned to them
    const checkStudentQuery = `SELECT * FROM students WHERE id = $1 AND mentor_id = $2`;
    db.query(checkStudentQuery, [studentId, mentorId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      const rows = result?.rows || result;
      // If the student is not assigned to the mentor, send a 404 error
      if (rows.length === 0) {
        res.status(404).send("Student not assigned to this mentor");
        return;
      }

      // If the student is assigned to the mentor, check if the student evaluation has been completed already
      const checkStudentEvaluationCompleted = `SELECT * FROM students WHERE id = $1 AND evaluated_by IS NOT NULL`;
      db.query(checkStudentEvaluationCompleted, [studentId], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }
        
        const rows = result?.rows || result;
        if (rows.length > 0) {
          return res
            .status(400)
            .send("Student evaluation has already been completed");
        }

        // If the student evaluation has not been completed, then check if student has been marked
        const checkMarkedQuery = `SELECT * FROM student_marks WHERE student_id = $1`;
        db.query(checkMarkedQuery, [studentId], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
          }

          const rows = result?.rows || result;
          // If the student has already been marked, update the marks
          if (rows.length > 0) {
            let updateMarksQuery = `UPDATE student_marks SET`;
            let params = [];
            let paramIndex = 1;

            if (idea_marks !== undefined) {
              updateMarksQuery += ` idea_marks = $${paramIndex},`;
              params.push(idea_marks);
              paramIndex++;
            }
            if (execution_marks !== undefined) {
              updateMarksQuery += ` execution_marks = $${paramIndex},`;
              params.push(execution_marks);
              paramIndex++;
            }
            if (presentation_marks !== undefined) {
              updateMarksQuery += ` presentation_marks = $${paramIndex},`;
              params.push(presentation_marks);
              paramIndex++;
            }
            if (communication_marks !== undefined) {
              updateMarksQuery += ` communication_marks = $${paramIndex},`;
              params.push(communication_marks);
              paramIndex++;
            }

            updateMarksQuery = updateMarksQuery.slice(0, -1);
            updateMarksQuery += ` WHERE student_id = $${paramIndex}`;
            params.push(studentId);

            db.query(updateMarksQuery, params, (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).send("Internal Server Error");
              }

              res.status(200).send("Marks successfully updated for student");
            });
          } else {
            // If the student has not been marked, add the marks to the marks table
            const addMarksQuery = `INSERT INTO student_marks (student_id, idea_marks, execution_marks, presentation_marks, communication_marks) VALUES ($1, $2, $3, $4, $5)`;

            db.query(addMarksQuery, [studentId, idea_marks || null, execution_marks || null, presentation_marks || null, communication_marks || null], (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).send("Internal Server Error");
              }

              res.status(200).send("Marks successfully added for student");
            });
          }
        });
      });
    });
  });
};

// Controller for evaluating a student's performance
const evaluateStudent = (req, res) => {
  const studentId = req.params.studentId;
  const mentorId = req.params.mentorId;

  // Check if the student exists
  const checkStudentQuery = `SELECT * FROM students WHERE id = $1`;
  db.query(checkStudentQuery, [studentId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }

    const rows = result?.rows || result;
    // If the student doesn't exist, send a 404 error
    if (rows.length === 0) {
      res.status(404).send("Student not found");
      return;
    }

    // If the student exists, check if the mentor exists
    const checkMentorQuery = `SELECT * FROM mentors WHERE id = $1`;
    db.query(checkMentorQuery, [mentorId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      const rows = result?.rows || result;
      // If the mentor doesn't exist, send a 404 error
      if (rows.length === 0) {
        res.status(404).send("Mentor not found");
        return;
      }

      // If the mentor exists, check if the student is assigned to them
      const checkStudentMentorQuery = `SELECT * FROM students WHERE id = $1 AND mentor_id = $2`;
      db.query(checkStudentMentorQuery, [studentId, mentorId], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }

        const rows = result?.rows || result;
        // If the student is not assigned to the mentor, send a 404 error
        if (rows.length === 0) {
          res.status(404).send("Student not assigned to this mentor");
          return;
        }

        // If the student is assigned to the mentor, update the evaluated_by column of the student with the mentor_id
        const updateEvaluatedByQuery = `UPDATE students SET evaluated_by = $1 WHERE id = $2`;
        db.query(updateEvaluatedByQuery, [mentorId, studentId], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
          }

          res
            .status(200)
            .send(
              `Student ${studentId} successfully marked as evaluated by mentor ${mentorId}`
            );
        });
      });
    });
  });
};

module.exports = {
  searchMentor,
  getAssignedStudents,
  assignStudent,
  unassignStudent,
  markStudent,
  evaluateStudent,
};