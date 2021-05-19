import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";

import { API } from "../config/api";
import DetailDonate from "../components/DetailDonate";

const Detaildonate = () => {
  const [detailDonate, setDetailDonate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setIsError] = useState(false);
  const params = useParams();
  const { id } = params;

  const loadDonate = async () => {
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
    loadDonate();
  }, []);

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
