import React from 'react';
import { Button, Modal } from 'rsuite';
import { request } from '../../common/components/helpers/axios_helper';

const ScheduleDeleteModal = ({eventInfo, pickSchedule, modal_Close, user}) => {

    const deleteSchedule = () => {
        if (eventInfo.emp_no !== user.emp_no) {
          alert("작성자만 삭제 가능합니다.")
          return false;
        }
        request("DELETE", "/schedule/deleteSchedule/"+ eventInfo.sch_no )
          .then((res) => {
            if (res.status === 200) {
              alert("삭제 하였습니다.");
              window.location.reload(); // 새로고침
            } else {
              alert("일정 삭제 실패하였습니다");
            }
          })
          .catch((error) => {
            console.log("실패", error);
          });
      }

    return (
        <div>
             <Modal.Header style={{ width: "200px" }}>
                <Modal.Title>!주의!</Modal.Title>
            </Modal.Header>
            <Modal.Body>해당 일정을 삭제하면 복구할 수 없습니다.</Modal.Body>
            <Modal.Footer>
                <Button onClick={deleteSchedule} appearance="primary">
                    Ok
                </Button>
                <Button onClick={modal_Close} appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </div>
    );
};

export default ScheduleDeleteModal;