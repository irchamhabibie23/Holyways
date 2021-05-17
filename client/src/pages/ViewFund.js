import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Container, Row, Button, Card } from "react-bootstrap";

import { API } from "../config/api";

import DetailDonate from "../components/DetailDonate";
import { convertToRupiah } from "../utils";
import { UserContext } from "../contexts/userContext";
import LoadingPage from "./LoadingPage";

let socket;

const ViewFund = () => {
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [viewmyfunds, setViewMyFunds] = useState([]);
  const params = useParams();
  const { id } = params;

  const loadFunds = async () => {
    try {
      const response = await API.get(`/fund/${id}`);
      setViewMyFunds(response.data.data.funds[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFunds();
  }, [state.isVisibleApprove]);

  // const loadFund = async (socket) => {
  //   await socket.emit("load fund");
  //   console.log("Test");
  //   await socket.on("fund", (todo) => {
  //     setViewMyFunds(todo.data);
  //     setIsLoading(false);
  //   });
  // };

  // useEffect(() => {
  //   socket = io("http://localhost:5000/fund", {
  //     auth: {
  //       token: localStorage.getItem("token"),
  //       id: id,
  //     },
  //   });

  //   loadFund(socket);
  //   return () => {
  //     socket.disconnect();
  //     console.log(socket);
  //   };
  // }, []);

  const handleApproveModalBuka = (approveModal, id) => {
    dispatch({
      type: "APPROVEMODALBUKA",
      payload: {
        approveModal,
        id,
      },
    });
  };

  const approvedDonation = viewmyfunds?.donationList?.filter(
    (donatur) => donatur.status !== "Pending"
  );

  const pendingDonation = viewmyfunds?.donationList?.filter(
    (donatur) => donatur.status === "Pending"
  );

  return (
    <Container style={{ marginTop: "79px" }}>
      {isLoading === true ? (
        <LoadingPage />
      ) : (
        <>
          <Container style={{ marginTop: "79px" }}>
            {[viewmyfunds]?.map((viewmyfunds) => {
              return (
                <>
                  <DetailDonate
                    detailDonate={viewmyfunds}
                    approvedDonation={approvedDonation}
                  />
                </>
              );
            })}
          </Container>
        </>
      )}

      <Row style={{ marginTop: "61px", marginBottom: "29px" }}>
        <h3>Donation has not been approved ({pendingDonation?.length})</h3>
      </Row>
      <div
        className='scroll'
        style={{
          height: "333px",
          overflow: "scroll",
        }}>
        {pendingDonation?.map((approve) => (
          // <Card style={{ width: "auto", marginBottom: "10px" }}>
          //   <Card.Body
          //     style={{
          //       marginLeft: "16px",
          //       marginTop: "15px",
          //       marginBottom: "20px",
          //     }}>
          //     <Card.Title>{approve.fullname}</Card.Title>
          //     <Card.Text className='d-flex justify-content-between'>
          //       <Card.Subtitle className='mb-2 text-muted'>
          //         {approve.updatedAt}
          //       </Card.Subtitle>
          //       <Button
          //         onClick={() => handleApproveModalBuka([approve], id)}
          //         style={{ marginRight: "34px", width: "100px" }}>
          //         View
          //       </Button>
          //     </Card.Text>
          //     <Card.Text>Total : {convertToRupiah(approve.amount)}</Card.Text>
          //   </Card.Body>
          // </Card>

          <Card style={{ width: "auto", marginBottom: "10px" }}>
            <Card.Body
              style={{
                marginLeft: "16px",
                marginTop: "15px",
                marginBottom: "20px",
              }}>
              <Card.Title className='mb-4 b font-weight-bold'>
                {approve.fullname}
              </Card.Title>
              <Card.Text className='mb-0 d-flex justify-content-between'>
                <Card.Subtitle className='mb-4 text-muted'>
                  {approve.updatedAt}
                </Card.Subtitle>
                <Button
                  onClick={() => handleApproveModalBuka([approve], id)}
                  style={{ marginRight: "34px", width: "100px" }}>
                  View
                </Button>
              </Card.Text>
              <Card.Text
                style={{
                  color: "rgba(151, 74, 74, 1)",
                  fontWeight: "bold",
                }}
                className='mb-0 font-weight-bold'>
                Total : {convertToRupiah(approve.amount)}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className='card-footer'></div>
    </Container>
  );
};

export default ViewFund;
