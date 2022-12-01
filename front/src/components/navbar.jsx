import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';


const NavBar = ({user}) => {
    return ( 
        <Navbar className='table-info'   >
        <Container >
          <Navbar.Brand href="/">Free Courses</Navbar.Brand>
          <Nav  className="me-auto">
            <Nav.Link href="/courses">Courses</Nav.Link>
            {/* <Nav.Link href="/students">Students</Nav.Link>
            <Nav.Link href="/rentals">Rentals</Nav.Link> */}
            {! user && (
            <React.Fragment>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </React.Fragment>
            )}
            { user && (
            <React.Fragment>
              <Nav.Link href="/profile">{user.name}</Nav.Link>
              <Nav.Link href="/logout">Logout</Nav.Link>
            </React.Fragment>
            )}
          </Nav>
        </Container>
      </Navbar>

       
     );
}
 
export default NavBar;