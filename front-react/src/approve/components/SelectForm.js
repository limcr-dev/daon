import { Button, Tree } from 'rsuite';
import "../css/approve.css";
import { useNavigate } from 'react-router-dom';

const data = [
 
  {
    label: '휴가결재',
    value: 'vacationMenu',
    children: [
      { label: '휴가 신청서', value: '1' },
      // { label: '결재 수신 문서', value: '2' },
      // { label: '결재 예정 문서', value: '3' },
      // { label: '참조/열람 대기 문서', value: '4' }
    ],
  },
  {
    label: '업무',
    value: 'workMenu',
    children: [
      { label: '업무기안서', value: '5' },

    ],
  }
  // {
  //   label: '근태',
  //   value: 'attendMenu',
  //   children: [
  //     { label: '연장 근무 신청', value: 'overTime' },

  //   ],
  // }
];

const SelectForm = ({ closeModal }) => {

  const navigate = useNavigate();

  const handleSelect = (selectedLabel) => {
    if (!selectedLabel.value.includes('Menu')) {
      navigate(`/approve/form/${selectedLabel.value}`);
      closeModal();
    }
  };

  return (
    <div className="height_change">
      <Tree data={data} defaultExpandAll className='h-full' onSelect={handleSelect} />
      <Button appearance="subtle" block onClick={closeModal} style={{ marginTop: "10px" }}>
        취소
      </Button>

    </div>

  );
};

export default SelectForm;
