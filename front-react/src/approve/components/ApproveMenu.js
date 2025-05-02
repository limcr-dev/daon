import { Tree } from 'rsuite';
import "../css/approve.css";
import { useNavigate } from 'react-router-dom';

const data = [
  {
    // 0: 신청, 1: 예정, 2: 대기, 3: 승인, 4: 반려, 4: 완료
    label: '결재 문서함',
    value: 'approveMenu',
    children: [
      { label: '결재 대기 목록', value: 'approver/2' },
      { label: '결재 예정 목록', value: 'approver/1' },
      { label: '결재 목록', value: 'approver/all' }
    ],
  },
  // 1: 임시저장, 2: 진행중, 3: 승인, 4: 반려, 5: 상신취소
  {
    label: '개인 문서함',
    value: 'documentMenu',
    children: [
      { label: '기안 목록', value: 'documents' },
      { label: '결재 진행 목록', value: 'documents/2' },
      { label: '결재 승인 목록', value: 'documents/3' },
      { label: '결재 반려 목록', value: 'documents/4' },
      { label: '임시 저장 목록', value: 'documents/1' },
    ],
  }
  // {
  //   label: '부서문서함',
  //   value: 'deptDocuments',
  //   children: [
  //     { label: '부서 문서함', value: 'docDept' },
  //     { label: '부서 참조함', value: 'docReferenced' }
  //   ],
  // },
];

const ApproveMenu = () => {
  const navigate = useNavigate();
  
  const handleSelect = (selectedLabel) => {
    if (!selectedLabel.value.includes('Menu')) {
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
