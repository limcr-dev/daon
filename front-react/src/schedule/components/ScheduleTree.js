import {
  Divider,
  Input,
  InputGroup,
} from "rsuite";
import "../css/ScheduleTree.css";

import React, { useEffect, useState } from "react";

// 공통 js
import { request } from "../../common/components/helpers/axios_helper";

// icon
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import CategoryFilter from "./CategoryFilter";

const ScheduleTree = ({ user }) => {
  // 스케쥴 카테고리 저장 함수
  const [schedule_setting, setSchedule_setting] = useState([]);

  // 스케쥴 카테고리 가져오기
  useEffect(() => {
    request("GET", "/schedule/getCategory/" + user.emp_no)
      .then((res) => {
        setSchedule_setting(res.data);
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, [user.emp_no]);

  // 카테고리 수정 전환
  const [editMode, setEditMode] = useState({
    top: false,
    bottom: false,
  });
  const handleCategoryEdit = (section) => {
    setEditMode((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 카테고리 추가
  const [addMode, setAddMode] = useState(false);
  const [addName, setAddName] = useState("");

  const handleCategoryAdd = () => {
    setAddMode((prev) => !prev);
  };
  const categoryAdd = () => {
    request("POST", `/schedule/addCategory/${user.emp_no}/${addName}`)
      .then((res) => {
        if (res.status === 200) {
          window.location.reload(); // 새로고침
        } else {
          alert("카테고리 추가 실패하였습니다");
        }
      })
      .catch((error) => {
        console.log("실패", error);
      });
  };
  // 카테고리 추가 끝

  const submitCategoryEdit = (e) => {};

  return (
    <div className="height_change">
      <form onSubmit={submitCategoryEdit}>
        <table style={{ margin: "auto", width: "200px", zIndex: "100" }}>
          <thead>
            <tr>
              <td colSpan={2}>
                일정 관리 &nbsp;&nbsp;
                {/* 버튼 전환 */}
                {!editMode.top ? (
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => handleCategoryEdit("top")}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCheck}
                    onClick={() => handleCategoryEdit("top")}
                  />
                )}
              </td>
            </tr>
          </thead>
          <tbody>
            {/* 일정 목록 */}
            <CategoryFilter
              schedule_setting={schedule_setting}
              type={"I"}
              edit={editMode.top}
            />
            <CategoryFilter
              schedule_setting={schedule_setting}
              type={"S"}
              edit={editMode.top}
            />

            {/* 카테고리 추가  */}
            {!editMode.top && (
              <>
                <tr>
                  <td align="left" colSpan={3}>
                    <button
                      type="button"
                      style={{ color: "gray" }}
                      onClick={handleCategoryAdd}
                    >
                      + 내 일정 카테고리 추가
                    </button>
                  </td>
                </tr>
                {/* 추가 버튼 눌렀을 시 전환 */}
                {addMode && (
                  <tr>
                    <td align="right" colSpan={3}>
                      <InputGroup>
                        <Input
                          maxLength={15}
                          onChange={(e) => setAddName(e)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              categoryAdd();
                            }
                          }}
                        />
                        <InputGroup.Button onClick={categoryAdd}>
                          추가
                        </InputGroup.Button>
                      </InputGroup>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </form>
      <Divider />

      {/* 하단 */}
      <form onSubmit={submitCategoryEdit}>
        <table style={{ margin: "auto", width: "200px" }}>
          <thead>
            <tr>
              <td colSpan={2}>
                전사 일정 &nbsp;&nbsp;
                {/* 버튼 전환 */}
                {!editMode.bottom ? (
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => handleCategoryEdit("bottom")}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCheck}
                    onClick={() => handleCategoryEdit("bottom")}
                  />
                )}
              </td>
            </tr>
          </thead>
          <tbody>
            {/* 전사 일정 목록 */}
            <CategoryFilter
              schedule_setting={schedule_setting}
              type={"A"}
              edit={editMode.bottom}
            />
          </tbody>
        </table>
      </form>
    </div>
  );
};
export default ScheduleTree;
