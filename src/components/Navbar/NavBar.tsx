import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("token"));
  });

  const syncAuthState = () => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  };

  useEffect(() => {
    syncAuthState();

    const handleStorage = () => {
      syncAuthState();
    };

    const handleAuthStateChanged = () => {
      syncAuthState();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("authStateChanged", handleAuthStateChanged);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authStateChanged", handleAuthStateChanged);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("authStateChanged"));
    syncAuthState();
    navigate("/signin");
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          {localStorage.getItem("role") !== "INSTRUCTOR" &&
            localStorage.getItem("role") !== "STUDENT" && (
              <Navbar.Brand as={NavLink} to="/">
                Home
              </Navbar.Brand>
            )}

          {isLoggedIn &&
            localStorage.getItem("role") !== "INSTRUCTOR" &&
            localStorage.getItem("role") !== "STUDENT" && (
              <Nav className="me-auto">
                <Nav.Link
                  as={NavLink}
                  to="/students"
                  className="custom-nav-link "
                >
                  Students
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/instructors"
                  className="custom-nav-link"
                >
                  Instructors
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/courses"
                  className="custom-nav-link"
                >
                  Courses
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/modules"
                  className="custom-nav-link"
                >
                  Modules
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/lessons"
                  className="custom-nav-link"
                >
                  Lessons
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/contents"
                  className="custom-nav-link"
                >
                  Contents
                </Nav.Link>
              </Nav>
            )}

          <Nav className={isLoggedIn ? "ms-auto" : "auth-links ms-auto"}>
            {!isLoggedIn ? (
              <>
                <Nav.Link as={NavLink} to="/signin" className="custom-nav-link">
                  Sign In
                </Nav.Link>
                <Nav.Link as={NavLink} to="/signup" className="custom-nav-link">
                  Sign Up
                </Nav.Link>
              </>
            ) : (
              <button
                className="btn btn-danger ms-2"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};
