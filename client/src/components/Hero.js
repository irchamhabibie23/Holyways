import { Container, Row, Card, Image, Button } from "react-bootstrap";

const Hero = () => {
  return (
    <Container fluid className='hero-container'>
      <Row className='d-flex justify-content-between'>
        <Card
          className='bg-transparent border-0 mt-5'
          style={{ marginLeft: "10vw", maxWidth: "40%" }}>
          <Card.Body>
            <Card.Title className='inf2-text1 mb-5 '>
              While you are still standing, try to reach out to the people who
              are falling.
            </Card.Title>
            <Card.Text
              className='inf1-text3 mb-5'
              style={{
                maxWidth: "75%",
              }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </Card.Text>
            <Card.Text>
              <Button className='btn-donate mt-1'>Donate Now</Button>
            </Card.Text>

            <Card.Text style={{ maxWidth: "423px", marginLeft: "-12vw" }}>
              <Image src='/1340554718 2.svg' className=' mt-3' />
            </Card.Text>
          </Card.Body>
        </Card>

        <Image className='pic-banjir mt-5' src='/1340554718 1.png' />
      </Row>
    </Container>
  );
};

export default Hero;
