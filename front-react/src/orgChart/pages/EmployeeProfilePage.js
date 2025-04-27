import React, { useEffect, useState } from 'react';
import { Loader, IconButton, Panel, Avatar } from 'rsuite';
import { MdClose } from 'react-icons/md';
import { request } from '../../common/components/helpers/axios_helper';
import { getPositionName, getDeptName } from "../../hrMgt/components/getEmployeeInfo";

const EmployeeProfilePage = ({ empNo, onClose }) => {
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empNo) {
      setLoading(true);
      request("get", `/api/employee/${empNo}`)
        .then((res) => {
          setEmp(res.data);
          setLoading(false);
        })
        .catch(() => {
          alert("사원 정보를 불러오지 못했습니다.");
          setLoading(false);
        });
    }
  }, [empNo]);

  const imageUrl = emp?.emp_img
    ? `http://localhost:8081/api/images/${encodeURIComponent(emp.emp_img)}`
    : '/default-profile.jpg';

  // 👉 커스텀 Header JSX
  const HeaderWithCloseButton = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>사원 상세 정보</span> {/* 왼쪽: 제목 */}
      <IconButton icon={<MdClose />} onClick={onClose} appearance="subtle" size="sm" /> {/* 오른쪽: 버튼 */}
    </div>
  );

  return (
    <div style={{ width: '400px', margin: '0 auto' }}> {/* 🔥 사이즈 조정도 추가했어 */}
      <Panel header={HeaderWithCloseButton} bordered> {/* header 교체 */}
        {loading ? (
          <Loader center content="로딩 중..." />
        ) : emp && (
          <div style={{ textAlign: 'center' }}>
            <Avatar
              src={imageUrl}
              size="lg"
              circle
              style={{ marginBottom: '10px' }}
              onError={(e) => { e.target.src = '/default-profile.png'; }}
            />
            <h4 style={{ marginBottom: '10px' }}>{emp.emp_name}</h4>
            <p>📧 사내메일: {emp.emp_email}</p>
            <p>📱 휴대폰: {emp.emp_mobile}</p>
            <p>📨 외부메일: {emp.emp_ext_email}</p>
            <p>🏢 부서: {getDeptName(emp.dept_no)}</p>
            <p>🎓 직급: {getPositionName(emp.position_id)}</p>
            <p>📍 재직상태: {emp.emp_status === 1 ? "재직" : emp.emp_status === 2 ? "휴직" : "퇴사"}</p>
          </div>
        )}
      </Panel>
    </div>
  );
};

export default EmployeeProfilePage;
