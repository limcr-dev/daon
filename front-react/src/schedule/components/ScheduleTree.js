import { Checkbox, Divider } from 'rsuite';
import "../css/ScheduleTree.css";
import { defaultTheme, ColorSwatch, ColorSwatchPicker, Provider } from '@adobe/react-spectrum';
import { ColorPicker, Flex, ColorEditor } from '@adobe/react-spectrum';
import React, { useEffect, useState } from 'react';

// icon
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ScheduleTree = (props) => {
  const categoryEdit = () => {

  }
  const emp_no = props.emp_no;

  const [schedule_setting, setSchedule_setting] = useState([]);

  // 스케쥴 카테고리 가져오기
  useEffect(() => {
    fetch("http://localhost:8081/attend/getCategory/" + emp_no, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((res) => {
        // moveDate 값이 변경될때만 set (날짜 이동 버튼 클릭 시에만)
        if (JSON.stringify(emp_no) !== JSON.stringify(res)) {
          setSchedule_setting(res);
          console.log(res)
        }
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [emp_no])

  return (
    <div className="height_change">

      <table style={{ margin: "auto", width: "200px", zIndex: "100" }}>
        <thead>
          <tr>
            <td colSpan={2}>
              일정 관리 &nbsp;&nbsp;<FontAwesomeIcon icon={faPenToSquare} onClick={categoryEdit} />
            </td>
          </tr>
        </thead>
        {/* 스케쥴 카테고리 목록 */}
        <tbody>
          {schedule_setting
            .filter(category => category.full_schedule === false)
            .map(category => (
              <tr key={category.sch_category_no}>
                <td style={{ width: "10%", paddingLeft: "10px"}}>
                  <Checkbox defaultChecked></Checkbox>
                </td>
                <td>{category.sch_category_title}</td>
                <td >
                  <Provider theme={defaultTheme} >
                    <ColorPicker
                      size="XS"
                      rounding="full"
                      defaultValue={category.sch_category_color}
                      backgroundColor="black"
                      style={{backgroundColor:"black" }}>
                      <Flex direction="column" gap="size-300">
                        <ColorEditor />
                        <ColorSwatchPicker>
                          <ColorSwatch color="#A00" />
                          <ColorSwatch color="#f80" />
                          <ColorSwatch color="#080" />
                          <ColorSwatch color="#08f" />
                          <ColorSwatch color="#088" />
                          <ColorSwatch color="#008" />
                        </ColorSwatchPicker>
                      </Flex>
                    </ColorPicker>
                  </Provider>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Divider />
      <table style={{ margin: "auto", width: "200px" }}>
        <thead>
          <tr>
            <td colSpan={2}>
              전사 일정 &nbsp;&nbsp;<FontAwesomeIcon icon={faPenToSquare} />
            </td>
          </tr>
        </thead>
        <tbody>
          {schedule_setting
            .filter(category => category.full_schedule === true)
            .map(category => (
              <tr key={category.sch_category_no}>
                <td style={{ width: "10%", paddingLeft: "10px" }}>
                  <Checkbox defaultChecked></Checkbox>
                </td>
                <td > {category.sch_category_title}</td>
                <td>
                  <Provider theme={defaultTheme} >
                    <ColorPicker
                      size="XS"
                      rounding="full"
                      defaultValue={category.sch_category_color}>
                      <Flex direction="column" gap="size-300">
                        <ColorEditor />
                        <ColorSwatchPicker>
                          <ColorSwatch color="#A00" />
                          <ColorSwatch color="#f80" />
                          <ColorSwatch color="#080" />
                          <ColorSwatch color="#08f" />
                          <ColorSwatch color="#088" />
                          <ColorSwatch color="#008" />
                        </ColorSwatchPicker>
                      </Flex>
                    </ColorPicker>
                  </Provider>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default ScheduleTree;
