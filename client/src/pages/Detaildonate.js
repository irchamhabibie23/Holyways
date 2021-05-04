import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Col,
  Row,
  Button,
  Image,
  Card,
  ProgressBar,
} from "react-bootstrap";

import { API } from "../config/api";
import DetailDonate from "../components/DetailDonate";

import { UserContext } from "../contexts/userContext";
import { convertToRupiah } from "../utils";

const Detaildonate = () => {
  const [detailDonate, setDetailDonate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [, dispatch] = useContext(UserContext);
  const params = useParams();
  const { id } = params;

  const loadTodos = async () => {
    try {
      const response = await API.get(`/fund/${id}`);
      setDetailDonate(response.data.data.funds[0]);
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadTodos();
  }, []);

  const handleDonateModalBuka = () => {
    dispatch({
      type: "DONATEMODALBUKA",
      payload: id,
    });
  };
  const approvedDonation = detailDonate?.donationList?.filter(
    (donatur) => donatur.status !== "Pending"
  );

  return (
    <Container>
      {isLoading === true ? (
        <div>Loading</div>
      ) : (
        <>
          <Container style={{ marginTop: "79px" }}>
            {[detailDonate]?.map((detailDonate) => {
              return (
                <>
                  <DetailDonate
                    detailDonate={detailDonate}
                    approvedDonation={approvedDonation}
                  />
                </>
              );
            })}
          </Container>
        </>
      )}
    </Container>
  );
};

export default Detaildonate;
