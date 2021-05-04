import { useContext, useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

import { UserContext } from "../contexts/userContext";

import { API, setAuthToken } from "../config/api";

const ModalLogin = () => {
  const [state, dispatch] = useContext(UserContext);
  const initialState = {
    email: "",
    password: "",
  };
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(initialState);
  const { email, password } = form;

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify({
        email,
        password,
      });

      const response = await API.post("/login", body, config);
      setMessage(response.data.message);

      setAuthToken(response.data.data.user.token);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data.user,
      });
      setForm(initialState);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginModalTutup = () => {
    dispatch({
      type: "LOGINMODALTUTUP",
    });
  };

  const handleRegisterModalBuka = () => {
    dispatch({
      type: "REGISTERMODALBUKA",
    });
  };

  return (
    <Modal
      size='sm'
      centered
      show={state.isVisibleLogin}
      onHide={() => {
        handleLoginModalTutup();
        setMessage("");
        setForm({
          email: "",
          password: "",
        });
      }}>
      <Modal.Body>
        <Modal.Title>Login</Modal.Title>
        <div className='body'>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}>
            {message && (
              <Alert className='text-center' variant={"danger"}>
                {message}
              </Alert>
            )}
            <Form.Control
              onChange={(e) => onChange(e)}
              name='email'
              type='email'
              value={email}
              placeholder='Email'
              required
            />
            <Form.Control
              onChange={(e) => onChange(e)}
              name='password'
              type='password'
              value={password}
              placeholder='Password'
              required
            />
            <Button block type='submit' size='lg'>
              Login
            </Button>
          </Form>
        </div>
        <div className='mt-2 d-flex justify-content-center'>
          Don't have an account? Click
          <p
            className='here ml-1'
            onClick={() => {
              handleLoginModalTutup();
              handleRegisterModalBuka();
            }}>
            <b>Here</b>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalLogin;
