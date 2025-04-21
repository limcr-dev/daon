import { Tree } from 'rsuite';
import "../css/approve.css";
import { useNavigate } from 'react-router-dom';

const data = [
  {
    label: '결재하기',
    value: 'approve',
    children: [
      { label: '결재 대기 문서', value: 'approver/1' },
      { label: '결재 수신 문서', value: 'approver/2' },
      { label: '결재 예정 문서', value: 'approver/0' },
    ],
  },
  // 1: 진행중, 2:승인, 3:반려, 4: 임시저장, 5:상신취소
  {
    label: '개인 문서함',
    value: 'EmpDocuments',
    children: [
      { label: '기안 문서함', value: 'documents' },
      { label: '임시 저장함', value: 'documents/4' },
      { label: '결재 문서함', value: 'approver' },
    ],
  },
  {
    label: '부서문서함',
    value: 'deptDocuments',
    children: [
      { label: '부서 문서함', value: 'docDept' },
      { label: '부서 참조함', value: 'docReferenced' }
    ],
  },
];

const ApproveMenu = () => {
  const navigate = useNavigate();
  const handleSelect = (selectedLabel) => {
    if (selectedLabel) {
      navigate(`/approve/${selectedLabel.value}`);
    }
  };
  return (
    <div className="height_change">
      <Tree data={data} defaultExpandAll className='h-full' onSelect={handleSelect} />
    </div>
  );
};
export default ApproveMenu;
