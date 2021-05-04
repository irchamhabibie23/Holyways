import { useContext } from "react";
import { Navbar, Nav, Container, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import { UserContext } from "../contexts/userContext";

import DropdownProfile from "./DropdownProfile";
import ModalApprove from "./ModalApprove";
import ModalDonate from "./ModalDonate";
import ModalLogin from "./ModalLogin";
import ModalRegister from "./ModalRegister";

const NavbarComponent = () => {
  const [state, dispatch] = useContext(UserContext);

  const handleLoginModalBuka = () => {
    dispatch({
      type: "LOGINMODALBUKA",
    });
  };

  const handleRegisterModalBuka = () => {
    dispatch({
      type: "REGISTERMODALBUKA",
    });
  };

  return (
    <>
      <Container fluid className='navbar-container' expand='lg'>
        <Navbar.Brand as={Link} to='/'>
          <Image src='/Icon.svg' alt='icon-holyways' className='icon' />
        </Navbar.Brand>
        <Nav>
          {!state.isLogin ? (
            <div>
              <Button className='btn-login' onClick={handleLoginModalBuka}>
                Login
              </Button>
              <Button className='btn-regis' onClick={handleRegisterModalBuka}>
                Register
              </Button>
            </div>
          ) : (
            <DropdownProfile />
          )}
        </Nav>
      </Container>

      <ModalLogin />
      <ModalRegister />
      <ModalDonate />
      <ModalApprove />
    </>
  );
};

export default NavbarComponent;
