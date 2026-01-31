import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";
import "./navbar.css";

const NavbarContainer = ({ activatedPage }) => {
  return (
    <>
      <div className="navbar-container">
        <Navbar className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">GDA Logo</Navbar.Brand>
            <Navbar.Brand href="/" className="houses-navbar">
              Houses
            </Navbar.Brand>
            <div className="nav-links">
              <Link
                to="/"
                className={activatedPage === "/" ? "text-primary" : ""}
              >
                Home Page
              </Link>
              <Link
                to="/livescores"
                className={
                  activatedPage === "/livescores" ? "text-primary" : ""
                }
              >
                Live Scores
              </Link>
              <Link
                to="/announcement"
                className={
                  activatedPage === "/announcement" ? "text-primary" : ""
                }
              >
                Announcement
              </Link>
            </div>
          </Container>
        </Navbar>
      </div>
    </>
  );
};

export default NavbarContainer;
