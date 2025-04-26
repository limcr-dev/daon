import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Input } from "rsuite";
import { request } from "../../common/components/helpers/axios_helper";

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
      request("PUT", `/schedule/colorEdit/${categoryNo}/${encodeURIComponent(color)}`)
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

  return (
    <>
      {!edit && (
        <>
          {schedule_setting
            .filter((category) => category.c_sch_type === type)
            .map((category) => (
              <tr key={category.c_sch_no}>
                <td style={{ width: "10%", paddingLeft: "10px" }}>
                  <Checkbox defaultChecked></Checkbox>
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
                <td style={{display:"flex"}}>
                  <Input
                    name="c_sch_title"
                    placeholder={category.c_sch_title}
                    defaultValue={category.c_sch_title}
                  />
                  <Button>수정</Button>
                </td>
              </tr>
            ))}
        </>
      )}
    </>
  );
};

export default CategoryFilter;
