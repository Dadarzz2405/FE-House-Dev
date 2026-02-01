import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import "./navbar.css";

const NavbarContainer = ({ activatedPage }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="/">
          <span className="brand-logo">🏠</span>
          <span className="brand-text">GDA Houses</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={activatedPage === "/" ? "active-link" : ""}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/livescores" 
              className={activatedPage === "/livescores" ? "active-link" : ""}
            >
              Live Scores
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/announcement" 
              className={activatedPage === "/announcement" ? "active-link" : ""}
            >
              Announcements
            </Nav.Link>
            <Nav.Link 
              href="http://localhost:5000/login"
              className="login-link"
            >
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarContainer;