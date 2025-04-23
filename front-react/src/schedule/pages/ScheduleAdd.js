import React, { useState } from 'react';
import { Button, DatePicker, Form, Modal, Tabs, TimePicker } from 'rsuite';
import { ko } from 'date-fns/locale';
import MemberAdd from './MemberAdd';


const ScheduleAdd = ({ open, onClose, user, pickDate }) => {


    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [pickMember, setPickMember] = useState([]);
    
    // 스케쥴 저장할 변수
    const [schedule, setSchedule] = useState();

    // 참석자 추가 모달창
    const [memberModalShow, setMemberModalShow] = useState(false);

    const closeMemberModal = () => setMemberModalShow(false);

    const openModalAddPage = () => {
        setMemberModalShow(true);
    }

    const [isVisible, setIsVisible] = useState(true);
    // 수정데이터 반영함수
    const changeValue = (e) => {
        setSchedule({
            ...schedule,
            [e.target.name]: e.target.value
        });
    };
    return (
        <div>
            {/* 참석자 추가 모달창 */}
            <MemberAdd open={memberModalShow} onClose={closeMemberModal} user={user} pickMember={pickMember} setPickMember={setPickMember} />
            <Modal
                open={open}
                onClose={() => {
                    onClose();
                    closeMemberModal();
                }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    maxHeight: "1500px",
                }}
                backdrop="static"
                dialogClassName="modal-450w"
            >
                <Modal.Header closeButton>
                    <Modal.Title>일정 추가</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form style={{ minWidth: "400px", padding: "20px" }}>
                        <label style={{ minWidth: "360px" }}>
                            <Tabs
                                defaultActiveKey="1"
                                onSelect={(key) => {
                                    if (key === "2") {
                                        closeMemberModal();
                                        setPickMember([]);
                                        setIsVisible(false);
                                    }
                                    else {
                                        setIsVisible(true);
                                    }
                                }}>
                                <Tabs.Tab eventKey="1" title="일정등록">
                                </Tabs.Tab>
                                <Tabs.Tab eventKey="2" title="전사일정등록">
                                </Tabs.Tab>
                            </Tabs>
                        </label>
                        <div className="form-row">
                            <div className="form-group">
                                <label>일정명:</label>
                                <input type="text" name="emp_name" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>반복:</label>
                                <Button type="submit" appearance="primary">매주</Button>
                                <Button onClick={onClose} appearance="subtle">매월</Button>
                                <Button onClick={onClose} appearance="subtle">매년</Button>
                                {/* <input type="text" name="emp_name" value={attendance.emp_name} disabled /> */}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>일시:</label>
                                <DatePicker
                                    className="custom-datepicker"
                                    selected={pickDate}
                                    onChange={date => setStartDate(date)}
                                    format=" yyyy-MM-dd"
                                />&nbsp;&nbsp;&nbsp;
                                <TimePicker
                                    className="custom-datepicker"
                                    selected={pickDate}
                                    onChange={date => setEndDate(date)}
                                    format="HH:mm"
                                />&nbsp;&nbsp;&nbsp;
                                <Button variant="primary" onClick={onClose}>
                                    종일
                                </Button>
                            </div>
                        </div>
                        <div className="form-row">
                            <div style={{ marginLeft: "50px" }} className="form-group">
                                ~ &nbsp;
                                <DatePicker
                                    className="custom-datepicker"
                                    format=" yyyy-MM-dd"
                                    selected={pickDate}
                                    onChange={date => setStartDate(date)}
                                />&nbsp;&nbsp;&nbsp;
                                <TimePicker
                                    className="custom-datepicker"
                                    selected={pickDate}
                                    onChange={date => setStartDate(date)}
                                    format="HH:mm"
                                />
                            </div>
                        </div >
                            <div  style={{ display: isVisible ? 'block' : 'none' }}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>카테고리:</label>
                                        <select name="role_id" onChange={changeValue} required>
                                            <option value="">카테고리 선택</option>
                                            {/* 직원별 스케쥴 세팅의 카테고리 map 사용 예정 */}
                                            <option value="10">내 일정</option>
                                            <option value="20">공유 받은 일정</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group" style={{ height: "100px", overflowY: "scroll", }}>
                                        <label> 참석자: {pickMember?.map((member, index) =>
                                            <button type="button"
                                                style={{ marginRight: "8px", fontSize: "12px" }}
                                                onClick={() => {
                                                    setPickMember(prev => prev.filter((_, i) => i !== index));
                                                }}
                                            >{member} X
                                            </button>
                                        )}
                                            <button type='button'
                                                style={{ backgroundColor: "white", color: "gray" }}
                                                onClick={openModalAddPage}>+ 참석자 선택
                                            </button>
                                        </label>
                                    </div>
                                </div>
                            </div>
                    </form>

                </Modal.Body>

                <Modal.Footer>

                    <Button variant="primary" onClick={onClose}>
                        등록
                    </Button>
                    <Button variant="secondary" onClick={() => {
                        onClose();
                        closeMemberModal();
                    }}>
                        취소
                    </Button>
                </Modal.Footer>

            </Modal>
        </div >
    );
};

export default ScheduleAdd;