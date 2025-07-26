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
    // Check if student is already selected
    if (!selectedStudents.map((s) => s.id).includes(student.id)) {
      // Check if there are already 4 selected students
      if (selectedStudents.length < 4) {
        // Add student to selected students
        setSelectedStudents([...selectedStudents, student]);
      }
    } else {
      handleStudentDeselect(student);
    }
  };

  // Function to handle student deselection
  const handleStudentDeselect = (student) => {
    // Remove student from selected students
    setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
  };

  // Function to handle confirmation of selected students and assign them to the mentor
  const handleConfirmSelection = async () => {
    // Check if there are at least 1 selected students
    if (selectedStudents.length >= 1) {
      if (selectedStudents.length > 4) {
        alert("Please select at most 4 students");
      } else {
        const data = await assignStudent(
          mentor.id,
          selectedStudents.map((student) => student.id)
        );
        if (typeof data === "string") {
          setMessage(data);
        } else {
          navigate("/student-view");
        }
      }
    } else {
      alert("Please select at least 1 student");
    }
  };

  // Function to fetch students matching the search string from the server
  const fetchStudents = async (searchString) => {
    const data = await searchStudent(searchString);
    if (typeof data === "string") {
      setMessage(data);
    } else {
      const sortedData = data.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      setStudents(sortedData);
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
                    onClick={() => {
                      if (!student.evaluated_by && !student.mentor_id)
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
                    </Card.Body>
                    <Card.Footer>
                      {student.mentor_id ? (
                        <Button variant="warning" disabled>
                          Assigned
                        </Button>
                      ) : student.evaluated_by ? (
                        <Button variant="danger" disabled>
                          Evaluated
                        </Button>
                      ) : selectedStudents
                          .map((s) => s.id)
                          .includes(student.id) ? (
                        <Button
                          variant="outline-danger"
                          onClick={() => handleStudentDeselect(student)}
                        >
                          Deselect
                        </Button>
                      ) : (
                        <Button
                          variant="outline-primary"
                          onClick={() => handleStudentSelect(student)}
                        >
                          Select
                        </Button>
                      )}
                    </Card.Footer>
                  </Card>
                ))}
              </div>
            </div>
          </Col>
          <Col md={4} className="text-center">
            <h2 className="mt-4 mb-3">Selected Students</h2>
            <ul className="list-unstyled">
              {selectedStudents.map((student) => (
                <div className="card mb-3" key={student.id}>
                  <div className="card-body">
                    <h5 className="card-title">{student.name}</h5>
                    <p className="card-text">{`Email: ${student.email}`}</p>
                    <p className="card-text">{`Phone: ${student.phone}`}</p>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleStudentDeselect(student)}
                    >
                      Deselect
                    </button>
                  </div>
                </div>
              ))}
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
