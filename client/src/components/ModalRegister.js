import { useContext, useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

import { UserContext } from "../contexts/userContext";
import { API, setAuthToken } from "../config/api";

const ModalRegister = () => {
  const [state, dispatch] = useContext(UserContext);
  const [message, setMessage] = useState("");
  const initialState = {
    email: "",
    password: "",
    fullname: "",
  };
  const [form, setForm] = useState(initialState);
  const { email, password, fullname } = form;

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
        fullname,
      });

      const response = await API.post("/register", body, config);
      setMessage(response.data.message);

      if (message.length === 0) {
        setForm(initialState);
      }
      setAuthToken(response.data.data.user.token);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data.user,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegisterModalTutup = () => {
    dispatch({
      type: "REGISTERMODALTUTUP",
    });
  };
  const handleLoginModalBuka = () => {
    dispatch({
      type: "LOGINMODALBUKA",
    });
  };

  return (
    <Modal
      size='lg'
      centered
      show={state.isVisibleRegister}
      onHide={() => {
        handleRegisterModalTutup();
        setMessage("");
        setForm(initialState);
      }}>
      <Modal.Body>
        <Modal.Title>Register</Modal.Title>
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
            <Form.Control
              onChange={(e) => onChange(e)}
              name='fullname'
              type='text'
              value={fullname}
              placeholder='Full Name'
              required
            />
            <Button block size='lg' type='submit'>
              Register
            </Button>
            <div className='mt-2 d-flex justify-content-center'>
              Already have an account ? Click
              <p
                className='here ml-1'
                onClick={() => {
                  handleLoginModalBuka();
                  handleRegisterModalTutup();
                }}>
                <b>Here</b>
              </p>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRegister;
