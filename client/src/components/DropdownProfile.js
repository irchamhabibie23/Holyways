import { useContext } from "react";
import { NavDropdown, Col, Row, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import { API } from "../config/api";
import { UserContext } from "../contexts/userContext";

const DropdownProfile = () => {
  let { data: navbar } = useQuery("navbar", async () => {
    const response = await API.get("/profile");
    return response.data.data.profile[0];
  });
  const [, dispatch] = useContext(UserContext);
  const handleLogOut = () => {
    dispatch({
      type: "LOGOUT",
    });
  };
  return (
    <NavDropdown
      eventKey={1}
      title={
        <div className='pull-left'>
          <Image className='navbar-img' src={navbar?.thumbnail} roundedCircle />
        </div>
      }
      id='basic-nav-dropdown'>
      <NavDropdown.Item
        style={{ minWidth: "227px", padding: " 1.2rem 1.3rem" }}
        as={Link}
        to='/profile'>
        <Row className='d-flex justify-content-between'>
          <Col md='auto'>
            <Image
              style={{ width: "75%", marginTop: "2px" }}
              src='/user 2.svg'
            />
          </Col>
          <Col
            style={{ marginLeft: "10px", fontSize: "21px", fontWeight: "600" }}>
            Profile
          </Col>
        </Row>
      </NavDropdown.Item>
      <NavDropdown.Item
        style={{ padding: " 0.7rem 1.5rem" }}
        as={Link}
        to='/raisefund'>
        <Row className='d-flex justify-content-between'>
          <Col md='auto'>
            <Image
              style={{ width: "75%", marginTop: "4px" }}
              src='/Group 4.svg'
            />
          </Col>
          <Col
            style={{ marginLeft: "10px", fontSize: "21px", fontWeight: "600" }}>
            Rise Fund
          </Col>
        </Row>
      </NavDropdown.Item>
      <hr class='solid'></hr>
      <NavDropdown.Item
        style={{ padding: " 0.7rem 1.5rem" }}
        onClick={() => handleLogOut()}
        as={Link}
        to='/'>
        <Row className='d-flex justify-content-between'>
          <Col md='auto'>
            <Image style={{ width: "75%" }} src='/logout 1.svg' />
          </Col>
          <Col
            style={{ marginLeft: "10px", fontSize: "21px", fontWeight: "600" }}>
            Log Out
          </Col>
        </Row>
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default DropdownProfile;
