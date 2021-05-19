import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <Card style={{ height: "71rem" }} className='text-center'>
      <Card.Header></Card.Header>
      <Card.Title
        style={{ marginTop: "10vw", fontSize: "200px" }}
        className='text-center '>
        404 NOT FOUND
      </Card.Title>
      <Card.Body>
        <Button as={Link} to='/' size='lg' className='mt-5' variant='primary'>
          Go Back
        </Button>
      </Card.Body>
      <Card.Footer className='text-muted'></Card.Footer>
    </Card>
  );
};

export default NotFound;
