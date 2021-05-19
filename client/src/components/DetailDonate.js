import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Button, Image, Card, ProgressBar } from "react-bootstrap";

import { UserContext } from "../contexts/userContext";
import { convertToRupiah } from "../utils";

const DetailDonate = ({ detailDonate, approvedDonation }) => {
  const { title, thumbnail, totaldonation, goals, description } = detailDonate;

  const [, dispatch] = useContext(UserContext);
  const params = useParams();
  const { id } = params;
  const handleDonateModalBuka = () => {
    dispatch({
      type: "DONATEMODALBUKA",
      payload: id,
    });
  };

  return (
    <>
      <Row>
        <Col md='auto'>
          <Image
            style={{ height: "445px", width: "582.73px" }}
            src={thumbnail}
            rounded
          />
        </Col>
        <Col style={{ marginLeft: "84px" }}>
          <Card
            style={{
              maxWidth: "30rem",
              maxHeight: "30rem",
              backgroundColor: "transparent",
              border: "none",
            }}>
            <Card.Body style={{ marginTop: "0", height: "433px" }}>
              <Card.Title>
                <h2>{title}</h2>
              </Card.Title>
              <Card.Text
                class='d-flex justify-content-between'
                style={{ marginTop: "45px" }}>
                <Col>
                  <b>
                    {totaldonation == null
                      ? "Rp. 0"
                      : convertToRupiah(totaldonation)}
                  </b>
                </Col>
                <Col style={{ marginLeft: "1.5vw" }} md='auto'>
                  gathered from
                </Col>
                <Col style={{ marginLeft: "1.6vw" }} md='auto'>
                  <b>{goals && convertToRupiah(goals)}</b>
                </Col>
              </Card.Text>

              <ProgressBar
                style={{ height: "0.32rem" }}
                variant='danger'
                now={(totaldonation * 100) / goals}
              />

              <Card.Text className='d-flex d-flex justify-content-between'>
                <div>
                  <b>{approvedDonation?.length}</b> Donation
                </div>
                <div style={{ marginRight: "0.7vw" }}>
                  <b>150</b> More Day
                </div>
              </Card.Text>
              <Card.Text
                className='scroll'
                style={{
                  fontSize: "18px",
                  display: "block",
                  height: "210px",
                  overflowY: "scroll",
                  marginBottom: "1px",
                }}>
                {description}
              </Card.Text>
              <Card.Text>
                <Button
                  onClick={handleDonateModalBuka}
                  style={{ position: "absolute", bottom: "0", width: "90%" }}
                  variant='primary'>
                  Donate
                </Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: "61px" }}>
        <h3>List Donation ({approvedDonation?.length})</h3>
      </Row>
      <div
        className='scroll'
        style={{
          height: "333px",
          overflow: "scroll",
        }}>
        {approvedDonation.map((donatur) => (
          <Card style={{ width: "auto", marginBottom: "10px" }}>
            <Card.Body
              style={{
                marginLeft: "16px",
                marginTop: "15px",
                marginBottom: "20px",
              }}>
              <Card.Title className='mb-4 b font-weight-bold'>
                {donatur.fullname}
              </Card.Title>
              <Card.Subtitle className='mb-4 text-muted'>
                {donatur.updatedAt}
              </Card.Subtitle>
              <Card.Text
                style={{
                  color: "rgba(151, 74, 74, 1)",
                  fontWeight: "bold",
                }}
                className='mb-0 font-weight-bold'>
                Total : {convertToRupiah(donatur.amount)}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default DetailDonate;
