import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Header from "../Header";
import "./style.css";
function Layout(props) {
  const wasLoggedIn = () => (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar">
          <ul>
            <li>
              <NavLink exact to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/query">Query</NavLink>
            </li>
          </ul>
        </Col>
        <Col md={10} style={{ marginLeft: "auto", paddingTop: "60px" }}>
          {props.children}
        </Col>
      </Row>
    </Container>
  );
  return (
    <>
      <Header />
      {wasLoggedIn()}
    </>
  );
}

export default Layout;
