import { Button, List, Panel } from 'rsuite';
const SelectForm = ({ closeModal }) => {
  const formList = [
    "휴가 신청서",
    "지출 결의서",
    "업무 보고서",
    "프로젝트 승인서"
  ];

  return (
    <Panel bordered style={{ padding: "10px" }} >
      <List hover>
        {formList.map((form, index) => (
          <List.Item key={index} onClick={() => {
            alert(`선택된 양식: ${form}`);
            closeModal();
          }} style={{ cursor: "pointer" }}>
            {form}
          </List.Item>
        ))}
      </List>
      <Button appearance="subtle" block onClick={closeModal} style={{ marginTop: "10px" }}>
        취소
      </Button>
    </Panel>
  );
};

export default SelectForm;
