import { Container, Row, Col } from "react-bootstrap";

const Hero2 = () => {
  return (
    <Container fluid className='hero-container2'>
      <Row
        style={{ marginTop: "148px" }}
        className='d-flex justify-content-center'>
        <Col style={{ maxWidth: "38.291828vw" }} className='inf2-text2'>
          Your donation is very helpful for people affected by forest fires in
          Kalimantan.
        </Col>
      </Row>
      <Row className='d-flex justify-content-center mt-5'>
        <Col style={{ maxWidth: "19.28vw", marginLeft: "5vw" }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </Col>
        <Col style={{ maxWidth: "19.28vw", marginLeft: "4vw" }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </Col>
      </Row>
    </Container>
  );
};

export default Hero2;
