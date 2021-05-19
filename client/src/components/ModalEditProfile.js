import { useContext, useState, useEffect } from "react";
import { Modal, Row, Col, Button, Form, Image, Alert } from "react-bootstrap";

import { API } from "../config/api";

import { UserContext } from "../contexts/userContext";
const ModalEditProfile = () => {
  const [state, dispatch] = useContext(UserContext);
  const [preview, setPreview] = useState();
  const [message, setMessage] = useState(undefined);
  const initialState = {
    fullname: undefined,
    email: undefined,
    phone: undefined,
    imageFile: undefined,
  };

  const [form, setForm] = useState(initialState);

  const handlePressed = () => {
    dispatch({ type: "ISPRESSED" });
  };
  const handleEditProfileTutup = () => {
    dispatch({ type: "EDITPROFILETUTUP" });
  };

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };

  const updateTodo = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const formData = new FormData();

      if (form.fullname) {
        formData.set("fullname", form.fullname);
      }
      if (form.phone) {
        formData.set("phone", form.phone);
      }
      if (form.email) {
        formData.set("email", form.email);
      }
      if (form.imageFile) {
        formData.append("imageFile", form.imageFile, form.imageFile.name);
      }

      const response = await API.patch("/update", formData, config);
      setMessage(response.data.message);
      if (!response.data.message) {
        handlePressed();
        handleEditProfileTutup();
        setForm(initialState);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!form.imageFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(form.imageFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [form.imageFile]);

  return (
    <Modal
      centered
      show={state.isVisibleEditProfile}
      onHide={() => {
        handleEditProfileTutup();
        setForm(initialState);
        setMessage(undefined);
      }}>
      {[state.editProfileModal].map((approvedData) => {
        return (
          <>
            <Modal.Body>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateTodo(e);
                }}>
                <Row className='w-100 justify-content-center'>
                  {form.imageFile ? (
                    <Image
                      style={{ width: "225px", height: "225px" }}
                      src={preview}
                    />
                  ) : (
                    <Image
                      style={{ width: "225px", height: "225px" }}
                      src={approvedData.thumbnail}
                    />
                  )}
                </Row>
                <Row className='justify-content-md-center'>
                  <Col md='auto'>
                    <label className='mt-2 custom-file-upload btn-primary btn btn-block'>
                      <input
                        onChange={(e) => onChange(e)}
                        name='imageFile'
                        type='file'
                      />
                      <div>Change Picture</div>
                    </label>
                  </Col>
                </Row>

                <Form.Group as={Row} controlId='formPlaintextEmail'>
                  <Form.Label column sm='3'>
                    Full Name
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      name='fullname'
                      onChange={(e) => onChange(e)}
                      defaultValue={approvedData.fullname}
                    />
                  </Col>
                  <Form.Label column sm='3'>
                    Email
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      name='email'
                      onChange={(e) => onChange(e)}
                      defaultValue={approvedData.email}
                    />
                  </Col>
                  <Form.Label column sm='3'>
                    Phone
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      name='phone'
                      onChange={(e) => onChange(e)}
                      defaultValue={approvedData.phone}
                    />
                  </Col>
                </Form.Group>
                {message && (
                  <Alert className='text-center' variant={"danger"}>
                    {message}
                  </Alert>
                )}
                <Button className='mt-1' type='submit' block variant='primary'>
                  Edit
                </Button>
              </Form>
              {JSON.stringify(form)}
              {JSON.stringify(state.editIsPressed)}
            </Modal.Body>
          </>
        );
      })}
    </Modal>
  );
};

export default ModalEditProfile;
