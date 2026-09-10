import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";

export const NavBar = () => {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            Home
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/students" className="custom-nav-link ">
              Students
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/instructors"
              className="custom-nav-link"
            >
              Instructors
            </Nav.Link>
            <Nav.Link as={NavLink} to="/courses" className="custom-nav-link">
              Courses
            </Nav.Link>
            <Nav.Link as={NavLink} to="/modules" className="custom-nav-link">
              Modules
            </Nav.Link>
            <Nav.Link as={NavLink} to="/lessons" className="custom-nav-link">
              Lessons
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contents" className="custom-nav-link">
              Contents
            </Nav.Link>
          </Nav>

          <Nav className="auth-links ms-auto">
            <Nav.Link as={NavLink} to="/signin" className="custom-nav-link">
              Sign In
            </Nav.Link>
            <Nav.Link as={NavLink} to="/signup" className="custom-nav-link">
              Sign Up
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};
