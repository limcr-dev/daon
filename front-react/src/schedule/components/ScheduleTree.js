import { Checkbox, Col, Divider, Dropdown, Input } from "rsuite";
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

  // 카테고리 수정
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

  const submitCategortEdit = (e) => { };
  return (
    <div className="height_change">
      <form onSubmit={submitCategortEdit}>
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
              <tr>
                <td colSpan={2}>
                  <button type="button" style={{ color: "gray" }}>
                    + 내 일정 카테고리 추가
                  </button>
                  {/* <Input
                    placeholder={"카테고리 명"}
                  /> */}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </form>
      <Divider />

      {/* 하단 */}
      <form onSubmit={submitCategortEdit}>
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
