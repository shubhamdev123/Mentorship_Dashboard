import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  FormControl,
  Alert,
} from "react-bootstrap";
import NavigationBar from "../Components/NavigationBar";
import { assignStudent, searchStudent } from "../utils/api";
import { useNavigate } from "react-router-dom";

const StudentSelectPage = () => {
  // Get the mentor value from localStorage
  let mentor = localStorage.getItem("mentor");
  mentor = JSON.parse(mentor);

  const navigate = useNavigate();

  // Set up state for search string, list of students, selected students, error message, and whether to show the message
  const [searchString, setSearchString] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(true);

  // Function to handle search form submission and fetch matching students from the server
  const handleStudentSearch = (e) => {
    e.preventDefault();
    fetchStudents(searchString);
  };

  // Function to handle student selection/deselection
  const handleStudentSelect = (student) => {
    console.log('Student selected:', student);
    console.log('Current selected students:', selectedStudents);
    
    // Check if student is already selected
    const isAlreadySelected = selectedStudents.some((s) => s.id === student.id);
    
    if (!isAlreadySelected) {
      // Check if there are already 4 selected students
      if (selectedStudents.length < 4) {
        // Add student to selected students
        const newSelectedStudents = [...selectedStudents, student];
        setSelectedStudents(newSelectedStudents);
        console.log('Updated selected students:', newSelectedStudents);
      } else {
        alert("You can only select up to 4 students");
      }
    } else {
      handleStudentDeselect(student);
    }
  };

  // Function to handle student deselection
  const handleStudentDeselect = (student) => {
    console.log('Student deselected:', student);
    // Remove student from selected students
    const newSelectedStudents = selectedStudents.filter((s) => s.id !== student.id);
    setSelectedStudents(newSelectedStudents);
    console.log('Updated selected students after deselection:', newSelectedStudents);
  };

  // Function to handle confirmation of selected students and assign them to the mentor
  const handleConfirmSelection = async () => {
    console.log('Confirm selection clicked');
    console.log('Selected students:', selectedStudents);
    console.log('Mentor:', mentor);
    
    // Check if there are at least 1 selected students
    if (selectedStudents.length >= 1) {
      if (selectedStudents.length > 4) {
        alert("Please select at most 4 students");
      } else {
        // Check if any students are being reassigned
        const reassignedStudents = selectedStudents.filter(student => student.mentor_id);
        const evaluatedStudents = selectedStudents.filter(student => student.evaluated_by);
        
        let confirmationMessage = `Assign ${selectedStudents.length} student(s) to ${mentor.name}?`;
        
        if (reassignedStudents.length > 0) {
          confirmationMessage += `\n\n⚠️ ${reassignedStudents.length} student(s) will be reassigned from their current mentor.`;
        }
        
        if (evaluatedStudents.length > 0) {
          confirmationMessage += `\n\nℹ️ ${evaluatedStudents.length} student(s) have already been evaluated.`;
        }
        
        if (window.confirm(confirmationMessage)) {
          try {
            const data = await assignStudent(
              mentor.id,
              selectedStudents.map((student) => student.id)
            );
            console.log('API response:', data);
            
            if (typeof data === "string") {
              setMessage(data);
              console.log('Error message set:', data);
            } else {
              console.log('Navigating to student-view');
              navigate("/student-view");
            }
          } catch (error) {
            console.error('Error in handleConfirmSelection:', error);
            setMessage('An error occurred while assigning students');
          }
        }
      }
    } else {
      alert("Please select at least 1 student");
    }
  };

  // Function to fetch students matching the search string from the server
  const fetchStudents = async (searchString) => {
    console.log('Fetching students with search string:', searchString);
    try {
      const data = await searchStudent(searchString);
      console.log('API response:', data);
      
      if (typeof data === "string") {
        setMessage(data);
        console.log('Error message set:', data);
      } else {
        const sortedData = data.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        console.log('Setting students:', sortedData);
        setStudents(sortedData);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage('Error fetching students');
    }
  };
  

  // Fetch all students when the page loads
  useEffect(() => {
    fetchStudents("");
  }, []);

  return (
    <>
      <NavigationBar />
      <Container fluid style={{ marginTop: "-40px" }}>
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            {message && show && (
              <Alert
                variant="danger"
                className="mt-2 d-flex align-items-center justify-content-between"
              >
                {message}
                <Button
                  className="close"
                  variant="danger"
                  onClick={() => setShow(false)}
                >
                  <span>&times;</span>
                </Button>
              </Alert>
            )}
            <div className="mx-3 my-2">
              <h2 className="mt-4 mb-3">Select Students</h2>
              <Form
                className="d-flex align-items-center"
                style={{ marginBottom: "20px" }}
                onSubmit={handleStudentSearch}
              >
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="mr-2"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  style={{ borderRadius: "20px 0 0 20px", border: "1px solid #ced4da" }}
                />
                <Button 
                  variant="primary" 
                  onClick={handleStudentSearch} 
                  style={{ 
                    borderRadius: "0 20px 20px 0", 
                    backgroundColor: "#007bff", 
                    border: "1px solid #007bff", 
                    padding: "6px 12px", // Adjust padding
                    margin: "0" // Adjust margin
                  }}
                >
                  Search
                </Button>
              </Form>

              <div className="d-flex flex-wrap justify-content-between">
                {students.map((student) => (
                  <Card
                    key={student.id}
                    className="m-2 student-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      console.log('Card clicked for student:', student);
                      // Allow selection regardless of current status
                      handleStudentSelect(student);
                    }}
                  >
                    <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
                      <Card.Img
                        variant="top"
                        src="/default_image.jpg"
                        alt="default_image"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title>{student.name}</Card.Title>
                      <Card.Text>{student.email}</Card.Text>
                      <Card.Text>{student.phone}</Card.Text>
                      {student.mentor_id && (
                        <div className="mt-2">
                          <small className="text-warning">
                            <strong>Currently assigned to Mentor ID: {student.mentor_id}</strong>
                          </small>
                        </div>
                      )}
                      {student.evaluated_by && (
                        <div className="mt-2">
                          <small className="text-info">
                            <strong>Evaluated by Mentor ID: {student.evaluated_by}</strong>
                          </small>
                        </div>
                      )}
                    </Card.Body>
                    <Card.Footer>
                      {selectedStudents.some((s) => s.id === student.id) ? (
                        <Button
                          variant="outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStudentDeselect(student);
                          }}
                        >
                          Deselect
                        </Button>
                      ) : (
                        <Button
                          variant="outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStudentSelect(student);
                          }}
                        >
                          {student.mentor_id ? 'Reassign' : student.evaluated_by ? 'Re-evaluate' : 'Select'}
                        </Button>
                      )}
                      {student.mentor_id && (
                        <div className="mt-1">
                          <small className="text-muted">Currently assigned to mentor</small>
                        </div>
                      )}
                      {student.evaluated_by && (
                        <div className="mt-1">
                          <small className="text-muted">Already evaluated</small>
                        </div>
                      )}
                    </Card.Footer>
                  </Card>
                ))}
              </div>
            </div>
          </Col>
          <Col md={4} className="text-center">
            <h2 className="mt-4 mb-3">Selected Students ({selectedStudents.length})</h2>
            
            {/* Debug info */}
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
              Debug: {selectedStudents.length} students selected
            </div>
            
            <ul className="list-unstyled">
              {selectedStudents.length === 0 ? (
                <div className="text-muted">
                  <p>No students selected yet</p>
                  <p>Click on student cards to select them</p>
                </div>
              ) : (
                selectedStudents.map((student) => (
                  <div className="card mb-3" key={student.id}>
                    <div className="card-body">
                      <h5 className="card-title">{student.name}</h5>
                      <p className="card-text">{`Email: ${student.email}`}</p>
                      <p className="card-text">{`Phone: ${student.phone}`}</p>
                      {student.mentor_id && (
                        <div className="alert alert-warning py-1 mb-2">
                          <small>⚠️ Currently assigned to another mentor</small>
                        </div>
                      )}
                      {student.evaluated_by && (
                        <div className="alert alert-info py-1 mb-2">
                          <small>ℹ️ Already evaluated</small>
                        </div>
                      )}
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleStudentDeselect(student)}
                      >
                        Deselect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </ul>
            <Button
              className="mt-4 confirmation-button"
              variant="success"
              onClick={handleConfirmSelection}
              style={{ fontSize: "1rem", backgroundColor: "#28a745", borderColor: "#28a745" }}
            >
              Confirm Selection
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default StudentSelectPage;
