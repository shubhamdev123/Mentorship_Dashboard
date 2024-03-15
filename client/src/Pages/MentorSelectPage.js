import { useState, useEffect } from "react";
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
import { searchMentor } from "../utils/api";
import { useNavigate } from "react-router-dom";

const MentorSelectPage = () => {
  // Get the mentor value from localStorage
  let mentor = localStorage.getItem("mentor");
  if (mentor) mentor = JSON.parse(mentor);

  const navigate = useNavigate();

  // state for search bar input
  const [searchString, setSearchString] = useState("");
  // state for the list of mentors
  const [mentors, setMentors] = useState([]);
  // state for the selected mentor
  const [selectedMentor, setSelectedMentor] = useState(mentor);
  // state for error messages
  const [message, setMessage] = useState("");
  // state for showing/hiding error message
  const [show, setShow] = useState(true);

  const handleMentorSearch = (e) => {
    e.preventDefault();
    // fetch mentors from the server based on search string
    fetchMentors(searchString);
  };

  const handleMentorSelect = (mentor) => {
    setSelectedMentor(
      // select/deselect mentor by updating state
      selectedMentor && selectedMentor.id === mentor.id ? null : mentor
    );
  };

  const handleConfirmSelection = () => {
    if (selectedMentor) {
      // save selected mentor to localStorage
      localStorage.setItem("mentor", JSON.stringify(selectedMentor));

      navigate("/student-select");
    } else {
      // display an alert if no mentor is selected
      alert("Please select a mentor");
    }
  };

  // Function to search for mentors on the server
  const fetchMentors = async (searchString) => {
    const data = await searchMentor(searchString);
    if (typeof data === "string") {
      // set error message if response is a string
      setMessage(data);
    } else {
      // set list of mentors if response is an array of mentors
      setMentors(data);
    }
  };

  useEffect(() => {
    // fetch all mentors from the server when the component mounts
    fetchMentors("");
  }, []);

  return (
    <>
      <NavigationBar />
      <Container fluid style={{ marginTop: "-40px", backgroundColor: "#f8f9fa" }}>
        <Row>
          <Col md={8}>
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
            <div className="d-flex align-items-center justify-content-between mx-3 my-2">
              <h2 className="mt-4 mb-3 d-inline-block" style={{ color: "#343a40" }}>Select Mentor</h2>
              <Form
                className="d-flex"
                style={{ height: "50px" }}
                onSubmit={handleMentorSearch}
              >
                <FormControl
                  type="text"
                  placeholder="Search mentor"
                  className="mr-sm-2"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                />
                <Button variant="outline-success" onClick={handleMentorSearch} style={{ color: "#fff", backgroundColor: "#28a745", padding: "0.5rem 1rem", fontSize: "1rem" }}>
                  Search
                </Button>
              </Form>
            </div>
            {/* // Inside the render method where you map over the `mentors` array */}
            <div className="d-flex flex-wrap">
              {mentors.map((mentor) => (
                <Card
                  key={mentor.id}
                  className="m-2"
                  style={{ width: "17rem", backgroundColor: "#fff", boxShadow: "0 0 10px rgba(0,0,0,0.1)", height: "auto" }}
                  onClick={() => handleMentorSelect(mentor)}
                >
                  <div style={{ position: "relative", paddingTop: "56.25%" }}>
                    <Card.Img
                      variant="top"
                      src="/default_image.jpg"
                      alt="default_image"
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title style={{ color: "#343a40" }}>{mentor.name}</Card.Title>
                    <Card.Text style={{ color: "#6c757d" }}>{mentor.email}</Card.Text>
                    <Card.Text style={{ color: "#6c757d" }}>{mentor.phone}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {selectedMentor && selectedMentor.id === mentor.id ? (
                      <Button
                        variant="outline-danger"
                        onClick={() => handleMentorSelect(mentor)}
                        style={{ fontSize: "0.9rem" }}
                      >
                        Deselect
                      </Button>
                    ) : (
                      <Button
                        variant="outline-primary"
                        onClick={() => handleMentorSelect(mentor)}
                        style={{ fontSize: "0.9rem" }}
                      >
                        Select
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              ))}
            </div>

          </Col>
          <Col
            md={4}
            className="text-center"
            style={{ borderLeft: "2px solid #ccc", minHeight: "100vh", backgroundColor: "#f8f9fa" }}
          >
            {selectedMentor ? (
              <>
                <h2 className="mt-4 mb-3" style={{ color: "#343a40" }}>Selected Mentor</h2>
                <Card style={{ width: "18rem", margin: "0 auto", backgroundColor: "#fff", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
                  <Card.Img
                    variant="top"
                    src="/default_image.jpg"
                    alt="default_image"
                  />
                  <Card.Body>
                    <Card.Title style={{ color: "#343a40" }}>{selectedMentor.name}</Card.Title>
                    <Card.Text style={{ color: "#6c757d" }}>{selectedMentor.email}</Card.Text>
                    <Card.Text style={{ color: "#6c757d" }}>{selectedMentor.phone}</Card.Text>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleMentorSelect(selectedMentor)}
                      style={{ color: "#dc3545", borderColor: "#dc3545", fontSize: "0.9rem" }}
                    >
                      Deselect
                    </Button>
                  </Card.Body>
                </Card>
              </>
            ) : (
              <>
                <h2 className="mt-4 mb-3" style={{ color: "#343a40" }}>Selected Mentor</h2>
                <p style={{ color: "#6c757d" }}>No mentor selected</p>
              </>
            )}
            <Button
              className="my-4"
              variant="outline-success"
              onClick={handleConfirmSelection}
              style={{ color: "#28a745", borderColor: "#28a745", fontSize: "1rem" }}
            >
              Confirm Selection
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MentorSelectPage;
