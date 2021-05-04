import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { Card, Button, ProgressBar, Row, Container } from "react-bootstrap";

import { UserContext } from "../contexts/userContext";
import { convertToRupiah } from "../utils";

const CardDonate = ({ donateList, tes }) => {
  const [state, dispatch] = useContext(UserContext);
  const {
    id,
    title,
    thumbnail,
    totaldonation,
    goals,
    description,
  } = donateList;

  const router = useHistory();

  const handleLoginModalBuka = () => {
    dispatch({
      type: "LOGINMODALBUKA",
    });
  };

  const goToDetailPage = () => {
    router.push(`/detaildonate/${id}`);
  };

  const goToViewFund = () => {
    router.push(`/viewfund/${id}`);
  };

  return (
    <Card className='kartu' style={{ width: "18rem", height: "26rem" }}>
      {tes == "viewFund" ? (
        <Card.Img
          style={{ cursor: "pointer", width: "288", height: "218px" }}
          onClick={goToViewFund}
          src={thumbnail}
          alt='img'
        />
      ) : !state.isLogin ? (
        <Card.Img
          style={{ cursor: "pointer", width: "288", height: "218px" }}
          onClick={handleLoginModalBuka}
          src={thumbnail}
          alt='img'
        />
      ) : (
        <Card.Img
          style={{ cursor: "pointer", width: "288", height: "218px" }}
          onClick={goToDetailPage}
          src={thumbnail}
          alt='img'
        />
      )}

      <Card.Body className='card-body'>
        <Card.Title
          style={{ fontSize: "19px", height: "44px" }}
          className='font-weight-bold'>
          {title}
        </Card.Title>
        <Card.Text
          style={{
            fontSize: "12px",
            maxWidth: "91%",
            maxHeight: "23%",
            overflow: "hidden",
          }}>
          {description}
        </Card.Text>
        <Container
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "1.4rem",
            width: "84%",
          }}>
          <ProgressBar
            style={{ height: "0.3rem" }}
            variant='danger'
            now={(totaldonation * 100) / goals}
          />
          <Card.Text className='d-flex justify-content-between mt-3 '>
            <div className='dana'>
              {!totaldonation ? "Rp. 0" : convertToRupiah(totaldonation)}
            </div>
            {tes == "viewFund" ? (
              <Button onClick={goToViewFund} size='sm'>
                View Fund
              </Button>
            ) : !state.isLogin ? (
              <Button onClick={handleLoginModalBuka} size='sm'>
                Donate
              </Button>
            ) : (
              <Button onClick={goToDetailPage} size='sm'>
                Donate
              </Button>
            )}
          </Card.Text>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default CardDonate;
