import React, { useEffect, useState } from "react";
import { Card, Input, InputGroup, SelectPicker } from "rsuite";
import Paging from "../../common/components/paging";
import {
  getDeptName,
  getPositionName,
} from "../../hrMgt/components/getEmployeeInfo";
import { request } from "../../common/components/helpers/axios_helper";

const AttendSettingRight = (user) => {
  const [employeesList, setEmployeesList] = useState([]);

  const [paging, setPaging] = useState({
    page: 1,
    size: 10,
    totalCount: 0,
  });
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState();
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    user: null,
  });

  const fetchData = (page = 1, search = keyword) => {
    const url = `/attend/workScheduleEmpList?page=${page}&size=${
      paging.size
    }&search=${search || ""}`;
    request("GET", "http://localhost:8081" + url)
      .then((res) => {
        const data = res.data; // res.data로 접근
        if (data && data.list) {
          setEmployeesList(data.list);
          setPaging(data.paging);
        } else {
          console.error("응답 형식 이상함:", data);
          setEmployeesList([]); // 기본값으로 비워줌
        }
      })
      .catch((err) => {
        console.error("API 요청 실패:", err);
        setEmployeesList([]);
      });
  };

  const handleContextMenu = (e, user) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      user,
    });
  };

  useEffect(() => {
    const handleClick = () => {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    };
    window.addEventListener("click", handleClick);

    fetchData();

    return () => window.removeEventListener("click", handleClick);
  }, []);

  const searchPerson = (value) => {
    setKeyword(value);
    fetchData(1, value); // 검색 시 1페이지부터 다시
  };

  // 근무유형 리스트
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

  // 근무유형 데이터변환
  const data = work_scheduleList.map((work_schedule) => ({
    label: work_schedule.type_name, // type_name을 label로
    value: work_schedule.work_type_no, // work_type_no을 value로
  }));

  // 선택된 근무유형을 상태로 관리
  const [selectedWorkType, setSelectedWorkType] = useState({});

  // SelectPicker 값이 변경되었을 때 호출되는 함수
  const handleChange = (value, emp_no) => {
    // 상태 업데이트
    setSelectedWorkType(value);

    // DB에 업데이트 요청
    request("PUT", "/attend/changeWorkSchedule/" + emp_no + "/" + value)
      .then((res) => {
        alert("근무유형이 성공적으로 업데이트되었습니다.");
        window.location.reload(); // 새로고침
      })
      .catch((error) => {
        alert("근무유형 업데이트 실패하였습니다.");
        console.error("근무유형 업데이트 실패", error);
      });
  };

  return (
    <div>
      <Card className="attendCard" style={{ height: "100%" }}>
        <Card.Header
          className="cardHeaderList"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "600", fontSize: "16px" }}>직원목록</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <InputGroup inside style={{ width: "300px" }}>
              <Input
                placeholder="사번/이름 입력"
                value={keyword}
                onChange={searchPerson}
              />
            </InputGroup>
          </div>
        </Card.Header>
        <table className="board-table">
          <thead>
            <tr>
              <th> 사번 </th>
              <th style={{ textAlign: "center" }}> 이름 </th>
              <th style={{ textAlign: "center" }}> 근무타입 </th>
              <th style={{ textAlign: "center" }}> 부서 </th>
              <th style={{ textAlign: "center" }}> 직급 </th>
            </tr>
          </thead>
          <tbody>
            {employeesList.map((employees, index) => (
              <tr
                key={index}
                onContextMenu={(e) => handleContextMenu(e, employees)}
                style={{ cursor: "context-menu" }}
              >
                <td> {employees.emp_no} </td>
                <td style={{ textAlign: "center" }}> {employees.emp_name} </td>
                <td style={{ textAlign: "center" }}>
                  {" "}
                  <SelectPicker
                    data={data}
                    searchable={false}
                    style={{ width: 224 }}
                    onChange={(value) => handleChange(value, employees.emp_no)} // 변경 시 handleChange 호출
                    value={
                      selectedWorkType[employees.emp_no] ||
                      employees.work_type_no
                    } // 선택된 값 표시
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  {getDeptName(employees.dept_no) || "-"}
                </td>
                <td style={{ textAlign: "center" }}>
                  {getPositionName(employees.position_id) || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ margin: "auto" }}>
          <Paging paging={paging} onPageChange={(page) => fetchData(page)} />
        </div>
      </Card>
    </div>
  );
};
export default AttendSettingRight;
