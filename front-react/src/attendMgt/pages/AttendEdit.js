import React, { useEffect, useState } from 'react';
import { Button, Modal, Radio, RadioGroup, Whisper } from 'rsuite';

// 공통js
import { request } from '../../common/components/helpers/axios_helper';

import { EditInfo, EditInfo2 } from '../components/Info';


const AttendEdit = ({ open, onClose, attendance_no, user }) => {

  // 근태 수정할 항목
  const [attendance, setAttendance] = useState({
    emp_no: 0,
    emp_name: "",
    date: "",
    check_in_time: "",
    check_out_time: "",
    late: 0,
    early_leave: 0,
    out_status: 0,
    absent: 0,
    message: "",
    modifier: user.emp_no,
    vacation: 0,
  });

  useEffect(() => {
    // 모달창이 열렸을 때만
    if (open) {
      request("GET", "/attend/pickAttend/" + attendance_no)
        .then((res) => res.data)
        .then((res) => {
          setAttendance({
            ...res, // 기존값 유지
            // 값이 없을 때 ""으로 처리
            check_in_time: res.check_in_time || "",
            check_out_time: res.check_out_time || "",
            message: res.message || "",

            // 수정자는 고정
            modifier: user.emp_no
          });
        })
        .catch((error) => {
          console.log('로그인정보를 확인해주세요', error);
        })
    }
  }, [attendance_no])


  // 수정 버튼 클릭 시
  const submitAttendEdit = (e) => {
    e.preventDefault(); // 폼 제출 기본 동작을 막음

    // 출퇴근 기록이 비어있거나 결근처리가 되어있으면 null로 값지정(오류예방)
    if (attendance.check_in_time === "" || attendance.absent === 1 || attendance.vacation === 1) {
      attendance.check_in_time = null;
    }
    if (attendance.check_out_time === "" || attendance.absent === 1 || attendance.vacation === 1) {
      attendance.check_out_time = null;
    }
    // 결근/휴가상태일 시 타 항목 정상처리
    if (attendance.absent === 1) {
      attendance.late = 0;
      attendance.early_leave = 0;
      attendance.out_status = 0;
    }
    if (attendance.vacation === 1) {
      attendance.late = 0;
      attendance.early_leave = 0;
      attendance.out_status = 0;
      attendance.absent = 0;
    }
    // 수정 request
    request("PUT", "/attend/attendEdit/", attendance)

      .then((res) => {
        if (res.status === 200) {
          alert("수정 성공");
          window.location.reload(); // 새로고침
          onClose(); // 모달창 닫기
        } else {
          alert("근태기록 수정 실패하였습니다");
        }
      })
      .catch((error) => {
        console.log('실패', error);
      });
  };
  // 입력값을 상태에 반영하는 함수
  const changeValue = (e) => {
    setAttendance({
      ...attendance,
      [e.target.name]: e.target.value
    });
  };
  return (
    <Modal backdrop={"static"} open={open} onClose={onClose}>
      <Modal.Header>
        <h3>근태 기록 수정
          <Whisper
            placement="right"
            trigger="click"
            speaker={EditInfo}
          > 💡
          </Whisper>
        </h3>

      </Modal.Header>
      <Modal.Body>
        <form onSubmit={submitAttendEdit} style={{ padding: "20px" }}>

          {/* 이름, 날짜 보여주기 위한 영역 */}
          <div className="form-row">
            <div className="form-group">
              <label>이름:</label>
              <input type="text" name="emp_name" value={attendance.emp_name} disabled />
            </div>
            <div className="form-group">
              <label>날짜:</label>
              <input type="text" name="date" value={attendance.date} disabled />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>출근 시간:</label>
              <input type="time" step="1" name="check_in_time"
                // 결근 또는 휴가기록이 있을 시 '' , 출근 시간이 없을 시 '' 
                value={(attendance.absent === 1 || attendance.vacation === 1) ? '' : (attendance.check_in_time ?? '')}
                onChange={changeValue}
                required
                // 결근 또는 휴가기록이 있을 시 비활성화
                disabled={attendance.absent === 1 || attendance.vacation === 1}
                // 퇴근시간을 넘지 못하게 설정
                max={attendance.check_out_time || undefined} />
            </div>
            <div className="form-group">
              <label>퇴근 시간:</label>
              <input type="time" step="1" name="check_out_time"
                // 결근 또는 휴가기록이 있을 시 '' , 퇴근 시간이 없을 시 ''
                value={(attendance.absent === 1 || attendance.vacation === 1) ? '' : (attendance.check_out_time ?? '')}
                onChange={changeValue}
                required
                // 결근 또는 휴가기록이 있을 시 비활성화
                disabled={attendance.absent === 1 || attendance.vacation === 1}
                // 출근시간을 넘지 못하게 설정
                min={attendance.check_in_time || undefined} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              지각여부<br></br>
              <RadioGroup name="late"
                // 결근 또는 휴가기록이 있을 시 0 
                value={(attendance.absent === 1 || attendance.vacation === 1) ? 0 : attendance.late}
                onChange={(value) => changeValue({ target: { name: "late", value } })}
                style={{ display: "inline" }}
                // 결근 또는 휴가기록이 있을 시 비활성화
                disabled={attendance.absent === 1 || attendance.vacation === 1}>
                <Radio value={0}>정상</Radio>&nbsp;&nbsp;&nbsp;
                <Radio value={1}>지각</Radio>
              </RadioGroup>
            </div>
            <div className="form-group">
              조퇴여부<br></br>
              <RadioGroup name="early_leave"
                // 결근 또는 휴가기록이 있을 시 0 
                value={(attendance.absent === 1 || attendance.vacation === 1) ? 0 : attendance.early_leave}
                onChange={(value) => changeValue({ target: { name: "early_leave", value } })}
                style={{ display: "inline" }}
                // 결근 또는 휴가기록이 있을 시 비활성화
                disabled={attendance.absent === 1 || attendance.vacation === 1}>
                <Radio value={0}>정상</Radio>&nbsp;&nbsp;&nbsp;
                <Radio value={1}>조퇴</Radio>
              </RadioGroup>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              결근여부<br></br>
              <RadioGroup name="absent"
                // 휴가기록이 있을 시 0 
                value={attendance.vacation === 1 ? 0 : attendance.absent}
                onChange={(value) => changeValue({ target: { name: "absent", value } })}
                style={{ display: "inline" }}
                // 휴가기록이 있을 시 비활성화
                disabled={attendance.vacation === 1}>
                <Radio value={0}>정상</Radio>&nbsp;&nbsp;&nbsp;
                <Radio value={1}>결근</Radio>
              </RadioGroup>
            </div>
            <div className="form-group">
              휴가여부<Whisper
                placement="right"
                trigger="click"
                speaker={EditInfo2}
              > 💡
              </Whisper><br></br>
              <RadioGroup name="out_status"
                value={attendance.vacation}
                onChange={(value) => changeValue({ target: { name: "vacation", value } })}
                style={{ display: "inline" }} >
                <Radio value={0}>근무</Radio>&nbsp;&nbsp;&nbsp;
                <Radio value={1}>휴가</Radio>
              </RadioGroup>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>수정 메시지:</label>
              <input type='text' name='message' value={attendance.message} onChange={changeValue} required></input>
            </div>
          </div>

          <div className="button">
            <Button type="submit" appearance="primary">등록</Button>
            <Button onClick={onClose} appearance="subtle">취소</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AttendEdit;