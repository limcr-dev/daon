import React, { useEffect, useState } from "react";
import { Button, Card, Checkbox, Modal } from "rsuite";
import WorkScheduleEdit from "../components/WorkScheduleEdit";
import WorkScheduleAdd from "../components/WorkScheduleAdd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { request } from "../../common/components/helpers/axios_helper";

import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
const AttendSettingLeft = (user) => {

  const [work_scheduleList, setWork_scheduleList] = useState([]);

  useEffect(() => {
    request("GET", "/attend/workType")
      .then((res) => {
        setWork_scheduleList(res.data);
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, [user.emp_no]);

  const [pickWork_type_no, setPickWork_type_no] = useState();

  // 근무유형정보 수정 모달창
  const [modalShow, setModalShow] = useState(false);
  const closeModal = () => setModalShow(false);

  const modalOpen = (Work_type_no) => {
    setPickWork_type_no(Work_type_no);
    setModalShow(true);
  };

  // 근무유형정보 추가 모달창
  const [addModalShow, setAddModalShow] = useState(false);
  const closeAddModal = () => setAddModalShow(false);

  const addModalOpen = () => {
    setAddModalShow(true);
  };

  // 삭제 체크리스트
  const [checkList, setCheckList] = useState([]);

  const handleCheckboxChange = (Work_type_no, isChecked) => {
    if (isChecked) {
      if (!checkList.includes(Work_type_no)) {
        setCheckList([...checkList, Work_type_no]);
      }
    } else {
      setCheckList(checkList.filter((no) => no !== Work_type_no));
    }
  };

  // 삭제 모달창
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const closeDeleteModal = () => setDeleteModalShow(false);

  const deleteModalOpen = () => {
    if (checkList.length < 1) {
      alert("삭제할 타입을 선택 해주세요");
      return false;
    }
    setDeleteModalShow(true);
  };

  const deleteWorkSchedule = () => {
    request("Delete", "/attend/deleteWorkSchedule", checkList)
      .then((res) => {
        window.location.reload(); // 새로고침
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  };

  return (
    <div style={{height:"100%"}}> 
      <Card className="attendCard" style={{height:"100%"}} >
        <Card.Header
          className="cardHeaderList"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "600", fontSize: "16px" }}>
            근무타입설정
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              style={{ backgroundColor: "#CECEF2" }}
              onClick={addModalOpen}
            >
              추가
            </Button>
            <Button onClick={deleteModalOpen}>삭제</Button>
          </div>
        </Card.Header>
        <table className="board-table">
          <thead>
            <tr>
              <td style={{ width: "5%", textAlign: "center" }}></td>
              <td style={{ width: "30%", textAlign: "center" }}>근무타입명</td>
              <td style={{ width: "20%", textAlign: "center" }}>출근시간</td>
              <td style={{ width: "20%", textAlign: "center" }}>퇴근시간</td>
              <td style={{ width: "20%", textAlign: "center" }}>근무시간</td>
              <td style={{ width: "5%", textAlign: "center" }}></td>
            </tr>
          </thead>
          <tbody>
            {work_scheduleList?.map((work_schedule) => (
              <tr key={work_schedule.work_type_no}>
                <td>
                  <Checkbox
                    onChange={(_, checked) =>
                      handleCheckboxChange(work_schedule.work_type_no, checked)
                    } // 상태 변경
                  ></Checkbox>
                </td>
                <td align="center">{work_schedule.type_name}</td>
                <td align="center">{work_schedule.start_time}</td>
                <td align="center">{work_schedule.end_time}</td>
                <td align="center">{work_schedule.total_time}</td>
                <td align="center">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => modalOpen(work_schedule.work_type_no)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {/* 등록 모달창 */}
      <Modal
        open={addModalShow}
        onClose={closeAddModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "1500px",
        }}
        backdrop="static"
        dialogClassName="modal-450w"
      >
        <WorkScheduleAdd closeAddModal={closeAddModal} />
      </Modal>

      {/* 수정 모달창 */}
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
        <WorkScheduleEdit
          closeModal={closeModal}
          pickWork_type_no={pickWork_type_no}
        />
      </Modal>
      {/* 삭제 모달창  */}
      <Modal
        open={deleteModalShow}
        onClose={closeDeleteModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Modal.Header style={{ width: "200px" }}>
          <Modal.Title>삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>삭제된 근무유형은 복구할 수 없습니다.</b>
          <br />
          삭제 후, 해당 근무유형에 속한 직원들의 근무유형은{" "}
          <b>가장 오래된 근무유형</b>으로 변경됩니다.
          <br />이 작업은 되돌릴 수 없습니다.
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={deleteWorkSchedule} appearance="primary">
            Ok
          </Button>
          <Button onClick={closeDeleteModal} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AttendSettingLeft;
