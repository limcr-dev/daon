import { Button, Divider, Modal, Sidebar, Sidenav, Text } from "rsuite";

import ScheduleTree from "../components/ScheduleTree";
import { useState } from "react";

// icon
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";

// css
import "../css/ScheduleLeftbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScheduleAdd from "./ScheduleAdd";

const ScheduleLeftbar = (user) => {
  // 스케쥴 추가 모달창
  const [modalShow, setModalShow] = useState(false);

  const closeModal = () => setModalShow(false);

  const openAddPage = (date) => {
    setModalShow(true);
  };

  return (
    <Sidebar style={{ backgroundColor: "#f0f0f0", width: "150px" }}>
      {/* 일정추가모달창 */}
      <Modal
        open={modalShow}
        onClose={closeModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "1500px",
        }}
        backdrop="static"
        dialogClassName="modal-450w"
      >
        <ScheduleAdd open={modalShow} onClose={closeModal} user={user} />
      </Modal>
      {/* header 시작 */}
      <Sidenav.Header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Text size={25} weight={"bold"} style={{ marginTop: "35px" }}>
          일정
        </Text>

        {/* 일정 등록 버튼 시작 */}
        <div style={{ marginTop: '15px', gap: "10px", display: "flex" }}>
          <Button style={{ backgroundColor: "#CECEF2" }} onClick={openAddPage}>
            <FontAwesomeIcon icon={faCalendarPlus} />{" "}
            <p style={{ margin: "5px" }}>일정 등록</p>
          </Button>
        </div>
        {/* 일정 등록 버튼 끝 */}
      </Sidenav.Header>
      <Divider />
      {/* header 끝 */}

      <Sidenav style={{ marginTop: "20px" }}>
        <Sidenav.Body style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
          <ScheduleTree user={user} />
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};
export default ScheduleLeftbar;
