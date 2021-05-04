import { useState, useEffect } from "react";
import { Container, Col, Row, Form, Button, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { API } from "../config/api";

const FormMakeFund = () => {
  const [preview, setPreview] = useState();
  const router = useHistory();
  const initialState = {
    title: "",
    goals: null,
    description: "",
    imageFile: "",
  };

  const [form, setFormData] = useState(initialState);
  const clearState = () => {
    setFormData({ ...initialState });
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

  const onChange = (e) => {
    setFormData({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const formData = new FormData();
      formData.set("title", form.title);
      formData.set("goals", form.goals);
      formData.set("description", form.description);
      formData.append("imageFile", form.imageFile, form.imageFile.name);
      await API.post(`/fund`, formData, config);
      clearState();
      router.push("/raisefund");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Row style={{ marginTop: "79px" }}>
        <Col>
          <h2>Make Raise Fund</h2>
        </Col>
      </Row>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}>
        <Form.Control
          onChange={(e) => onChange(e)}
          name='title'
          type='text'
          placeholder='Title'
        />
        <Row>
          <Col xs={4.5}>
            {form.imageFile && (
              <Image
                style={{ maxWidth: "300px", height: "230px" }}
                src={preview}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={4.5}>
            <label className='custom-file-upload btn-primary btn btn-block mt-4'>
              <input
                onChange={(e) => onChange(e)}
                name='imageFile'
                type='file'
              />
              <div>Attach Thumbnail</div>
            </label>
          </Col>
        </Row>

        <Form.Control
          onChange={(e) => onChange(e)}
          name='goals'
          style={{ marginTop: "24px" }}
          type='number'
          placeholder='Goals Donation'
        />
        <textarea
          name='description'
          onChange={(e) => onChange(e)}
          placeholder='Description'></textarea>
        <Row>
          <Col xs={8}></Col>
          <Col>
            <Button className='float-right w-100 ' type='submit'>
              Public Fundraising
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default FormMakeFund;
