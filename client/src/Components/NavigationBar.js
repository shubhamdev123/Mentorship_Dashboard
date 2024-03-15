import { Nav, Navbar, Container, NavDropdown, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap"; 

const CustomNavigationBar = () => {
  // Get the guide value from localStorage
  const guide = localStorage.getItem("guide");

  const navigate = useNavigate();

  // Function to clear localStorage and navigate to the home page
  const handleGuideChange = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Navbar
      bg="success" // Change background color to green
      variant="dark" // Change variant to dark
      expand="lg"
      style={{ marginBottom: "20px", borderRadius: "5px" }} // Change border radius to 5px
    >
      <Container className="px-3">
        <Navbar.Brand>Custom Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          {guide ? (
            <Nav>
              <LinkContainer
                to="/student-select"
                className="text-center navBorder"
                style={{
                  paddingRight: 10, // Adjust padding
                }}
              >
                <Nav.Link>Add Student</Nav.Link>
              </LinkContainer>
              <LinkContainer
                to="/student-view"
                className="text-center navBorder"
                style={{
                  paddingLeft: 10, // Adjust padding
                  paddingRight: 10, // Adjust padding
                }}
              >
                <Nav.Link>View Students</Nav.Link>
              </LinkContainer>
              <NavDropdown
                title={JSON.parse(localStorage.getItem("guide")).name}
                id="basic-nav-dropdown"
                className="text-center navBorder"
                style={{ paddingLeft: 10 }} // Adjust padding
              >
                <NavDropdown.Item onClick={() => handleGuideChange()}>
                  Terminate Session
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav>
              <Button 
                variant="outline-light" 
                style={{ 
                  backgroundColor: "#007bff", // Change background color to blue
                  border: "2px solid white", // Add border with white color
                  borderRadius: "20px", // Add border radius
                  padding: "6px 16px", // Adjust padding
                  fontWeight: "bold", // Make text bold
                  fontSize: "14px", // Adjust font size
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)" // Add box shadow
                }} 
                onClick={() => navigate("/")}
              >
                Select Guide
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavigationBar;
