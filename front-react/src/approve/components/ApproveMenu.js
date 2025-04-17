import { Tree } from 'rsuite';
import "../css/approve.css";

const data = [
  {
    label: '결재하기',
    value: 'approve',
    children: [
      { label: '결재 대기 문서', value: 'docWait' },
      { label: '결재 수신 문서', value: 'docReceive' },
      { label: '결재 예정 문서', value: 'docDue' },
      { label: '참조/열람 대기 문서', value: 'docWaitReadOnly' }
    ],
  },
  {
    label: '개인 문서함',
    value: 'EmpDocuments',
    children: [
      { label: '기안 문서함', value: 'docDraft' },
      { label: '임시 저장함', value: 'docTemporary' },
      { label: '결재 문서함', value: 'docApprove' },
      { label: '참조/열람 문서함', value: 'docReadOnly' },
      { label: '수신 문서함', value: 'docReceive' },
      { label: '발송 문서함', value: 'docSend' }
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
    return(
      <div className="height_change">
        <Tree data={data} defaultExpandAll className='h-full'/>
      </div>
);
};
export default ApproveMenu;
