import { useState, useEffect, useContext } from "react";
import { Row, Col, Container, Figure, Card, Button } from "react-bootstrap";
import { API } from "../config/api";
import { UserContext } from "../contexts/userContext";
import { convertToRupiah } from "../utils";
import LoadingPage from "./LoadingPage";

const Profile = () => {
  const [profile, setProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useContext(UserContext);

  const handleEditProfileBuka = (asd) => {
    dispatch({
      type: "EDITPROFILEBUKA",
      payload: asd,
    });
  };

  const loadProfile = async () => {
    try {
      const response = await API.get(`/profile`);
      setProfile(response.data.data.profile[0]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      loadProfile();
    }, 500);
  }, [state.editIsPressed]);

  useEffect(() => {
    setTimeout(() => {
      loadProfile();
    }, 500);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <Container className='profile-container'>
          <Row>
            <Col className='myprofile'>My Profile</Col>

            <Col className='myprofile'>History Donation</Col>
          </Row>
          <Row style={{ marginTop: "30px" }}>
            <Col md='auto' className='myprofile'>
              <Figure.Image
                style={{ width: "225px", height: "225px" }}
                src={profile?.thumbnail}
              />
            </Col>
            <Col style={{ marginLeft: "28px" }}>
              <div className='mb-4'>
                <Card.Title
                  style={{ color: "#c32424", fontSize: "larger" }}
                  className='mb-0 font-weight-bold'>
                  Full Name
                </Card.Title>
                <Card.Title className='mt-1 text-muted'>
                  {profile?.fullname}
                </Card.Title>
              </div>
              <div className='mb-4'>
                <Card.Title
                  style={{ color: "#c32424", fontSize: "larger" }}
                  className='mb-0 font-weight-bold'>
                  Email
                </Card.Title>
                <Card.Title className='mt-1 text-muted'>
                  {profile?.email}
                </Card.Title>
              </div>
              <div>
                <Card.Title
                  style={{ color: "#c32424", fontSize: "larger" }}
                  className='mb-0 font-weight-bold'>
                  Phone
                </Card.Title>
                <Card.Title className='mt-1 text-muted'>
                  {profile?.phone}
                </Card.Title>
              </div>
            </Col>
            <Col xs={6}>
              {profile?.donationList?.map((asd) => (
                <Card style={{ width: "auto" }}>
                  <Card.Body>
                    <Card.Title className='mb-3 mt-2 b font-weight-bold'>
                      {asd.title}
                    </Card.Title>
                    <Card.Title
                      style={{ fontSize: "0.9rem" }}
                      className='mb-4 text-muted'>
                      {asd.updatedAt}
                    </Card.Title>
                    <Row>
                      <Col
                        style={{
                          color: "rgba(151, 74, 74, 1)",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                        className=' font-weight-bold'>
                        Total : {convertToRupiah(asd.amount)}
                      </Col>
                      {asd.status === "Finished" ? (
                        <Col
                          xs={6}
                          md={3}
                          style={{
                            background: "rgba(0, 255, 117, 0.1)",
                            marginRight: "23px",
                            textAlign: "center",
                            color: "rgba(0, 255, 71, 1)",
                            fontWeight: "Bold",
                          }}>
                          {asd.status}
                        </Col>
                      ) : (
                        <Col
                          xs={6}
                          md={3}
                          style={{
                            background: "rgba(255, 117,0, 0.1)",
                            marginRight: "23px",
                            textAlign: "center",
                            color: "rgba(255, 71, 0, 1)",
                            fontWeight: "Bold",
                          }}>
                          {asd.status}
                        </Col>
                      )}
                    </Row>
                    <div></div>
                    <div
                      style={{
                        width: "112 px",
                        height: "19px",
                      }}></div>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
          <Button
            onClick={() => handleEditProfileBuka(profile)}
            style={{ marginRight: "34px", width: "100px" }}>
            View
          </Button>
          {JSON.stringify(state.editProfileModal.fullname)}
        </Container>
      )}
    </>
  );
};

export default Profile;
