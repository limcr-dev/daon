import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Input, Modal } from "rsuite";
import { request } from "../../common/components/helpers/axios_helper";
import { useCategory } from "./CategoryContext";
import CategoryDeleteModal from "./CategoryDeleteModal";

const CategoryFilter = ({ schedule_setting, type, edit }) => {
  // 수정할 색/카테고리번호 변수
  const [color, setColor] = useState("#ff0000");
  const [categoryNo, setCategoryNo] = useState();

  // 저장되기 전 임시 컬러
  const [tempoColor, setTempoColor] = useState("#ff0000");

  // 1초 딜레이 함수
  const saveTimeout = useRef(null);
  const changeColor = (color, c_sch_no) => {
    const selectedColor = color.target.value;
    setTempoColor(selectedColor);

    // 1초 갱신
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    // 1초 후 저장
    saveTimeout.current = setTimeout(() => {
      setCategoryNo(c_sch_no);
      setColor(selectedColor);
    }, 1000); // 1000ms = 1초
  };

  // 카테고리 색 저장
  useEffect(() => {
    if (categoryNo) {
      request(
        "PUT",
        `/schedule/colorEdit/${categoryNo}/${encodeURIComponent(color)}`
      )
        .then((res) => {
          if (res.status === 200) {
            window.location.reload(); // 새로고침
          } else {
            alert("색 수정 실패하였습니다");
          }
        })
        .catch((error) => {
          console.log("실패", error);
        });

      console.log("test" + color + categoryNo);
      console.log("test" + categoryNo);
    }
  }, [color]);

  // 카테고리 명 수정
  const name = useRef();
  const editName = (c_sch_no, name) => {
    request(
      "PUT",
      `/schedule/categoryNameEdit/${c_sch_no}/${name.current.value}`
    )
      .then((res) => {
        if (res.status === 200) {
          window.location.reload(); // 새로고침
        } else {
          alert("이름 수정을 실패하였습니다");
        }
      })
      .catch((error) => {
        console.log("실패", error);
      });
  };

  // 삭제 할 카테고리 저장 함수
  const [pickCategory, setPickCategory] = useState();
  // 삭제 확인 모달창
  const [deleteMadalOpen, setDeleteMadalOpen] = useState(false);

  const modal_open = (c_sch_no) => {
    setPickCategory(c_sch_no);
    setDeleteMadalOpen(true);
  }
  const modal_Close = () => setDeleteMadalOpen(false);

  // 카테고리 필터
  // 카테고리 체크 초기값 설정
  // const [category, setCategory] = useState(schedule_setting)
  const { selectedCategoryNos, handleCategoryChange } = useCategory();

  // `schedule_setting`을 `useCategory`로 초기화
  useEffect(() => {
    if (schedule_setting.length > 0) {
      const initialCategoryNos = schedule_setting.map((category) => category.c_sch_no);
      handleCategoryChange(initialCategoryNos); // `useCategory` 내 상태 변경
    }
  }, [schedule_setting]);

  // 체크 박스 변경 시
  const handleCheckboxChange = (categoryNo, isChecked) => {
    console.log("체크박스 상태:", isChecked);
    if (isChecked) {
      if (!selectedCategoryNos.includes(categoryNo)) {
        handleCategoryChange([...selectedCategoryNos, categoryNo]);
      }
    } else {
      handleCategoryChange(
        selectedCategoryNos.filter((no) => no !== categoryNo)
      );
    }
  };

  return (
    <>
      <Modal
        open={deleteMadalOpen}
        onClose={modal_Close}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      <CategoryDeleteModal pickCategory={pickCategory} modal_Close={modal_Close}/>
      </Modal>
      {!edit && (
        <>
          {schedule_setting
            .filter((category) => category.c_sch_type === type)
            .map((category) => (
              <tr key={category.c_sch_no}>
                <td style={{ width: "10%", paddingLeft: "10px" }}>
                  <Checkbox
                    // defaultChecked
                    checked={selectedCategoryNos.includes(category.c_sch_no)}
                    onChange={(_, checked) =>
                      handleCheckboxChange(category.c_sch_no, checked)
                    } // 상태 변경
                  ></Checkbox>
                </td>
                <td>{category.c_sch_title}</td>
                <td className="CustomColorPicker">
                  <input
                    type="color"
                    value={category.c_sch_color}
                    className="CustomColorPicker"
                    onChange={(e) => changeColor(e, category.c_sch_no)}
                  ></input>
                </td>
              </tr>
            ))}
        </>
      )}
      {/* 수정 상태 */}
      {edit && (
        <>
          {schedule_setting
            .filter((category) => category.c_sch_type === type)
            .map((category) => (
              <tr key={category.c_sch_no}>
                <td style={{ display: "flex" }}>
                  <Input
                    name="c_sch_title"
                    placeholder={category.c_sch_title}
                    defaultValue={category.c_sch_title}
                    ref={name}
                  />
                  <Button
                    style={{ backgroundColor: "#CECEF2" }}
                    onClick={() => editName(category.c_sch_no, name)}
                  >
                    수정
                  </Button>
                  <Button onClick={() => modal_open(category.c_sch_no)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
        </>
      )}
    </>
  );
};

export default CategoryFilter;
