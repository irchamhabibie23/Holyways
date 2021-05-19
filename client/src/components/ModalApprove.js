import { useContext } from "react";
import { Modal, Row, Col, Button, Form, Image } from "react-bootstrap";
import { convertToRupiah } from "../utils";
import { API } from "../config/api";

import { UserContext } from "../contexts/userContext";
const ModalApprove = () => {
  const [state, dispatch] = useContext(UserContext);

  const handleApproveModalTutup = () => {
    dispatch({
      type: "APPROVEMODALTUTUP",
    });
  };

  const updateTodo = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify({
        status: "Finished",
        email: state.approveListModal[0].email,
      });

      await API.patch(
        `/donate/${state.fundID}/${state.approveListModal[0].id}`,
        body,
        config
      );
      handleApproveModalTutup();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      centered
      show={state.isVisibleApprove}
      onHide={() => handleApproveModalTutup()}>
      {state.approveListModal.map((approvedData) => {
        return (
          <>
            <Modal.Body>
              <Row>
                <Col style={{ fontSize: "24px" }}>{approvedData.fullname}</Col>
              </Row>
              <Form.Control
                type='text'
                value={convertToRupiah(approvedData.amount)}
              />
              <Row className='d-flex justify-content-center'>
                <Image className='w-100' src={approvedData.proof} />
              </Row>

              <Button
                onClick={() => {
                  updateTodo();
                }}
                type='submit'
                size='lg'
                className='mt-4'
                block
                variant='primary'>
                Approve
              </Button>
            </Modal.Body>
          </>
        );
      })}
    </Modal>
  );
};

export default ModalApprove;
