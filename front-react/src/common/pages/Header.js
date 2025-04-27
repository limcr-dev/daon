import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../common/contexts/UserContext';
import { Avatar, IconButton } from 'rsuite';
import ExitIcon from '@rsuite/icons/Exit';
import EmailIcon from '@rsuite/icons/Email';
import MessageIcon from '@rsuite/icons/Message';
import WechatOutlineIcon from '@rsuite/icons/WechatOutline';
import { request } from '../../common/components/helpers/axios_helper';
import ProfileEditModal from './ProfileEditModal';

const Header = ({ onProfileUpdated }) => {
  const { user, logout } = useUser();
  const [empImg, setEmpImg] = useState(null);
  const [empName, setEmpName] = useState(user?.emp_name || '');
  const [showModal, setShowModal] = useState(false);

  // ✅ 사원이름 + 이미지 로딩
  const loadEmployeeInfo = useCallback(() => {
    if (user?.emp_no) {
      request("get", `/api/employee/${user.emp_no}`)
        .then((res) => {
          const { emp_img, emp_name } = res.data;
          if (emp_img) setEmpImg(emp_img);
          if (emp_name) setEmpName(emp_name);
        })
        .catch((err) => console.error("프로필 정보 로딩 실패:", err));
    }
  }, [user?.emp_no]);

  useEffect(() => {
    loadEmployeeInfo();
  }, [loadEmployeeInfo]);

  const imageUrl = empImg
    ? `http://localhost:8081/api/images/${encodeURIComponent(empImg)}`
    : '/default-profile.png';

  //메신저 실행
  const msgRun = () => {
    const url = `/messenger/messengerRun`;
    const features = 'width=500,height=600,resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no';
    window.open(url, '_blank', features)
  }

  // 메일 실행
  const emailRun = () => {
    const url = 'https://mail.daon-ai.com';
    const features = 'width=1024,height=768,resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no';
    window.open(url, 'DaonWebmail', features);
  }

  // 챗봇 실행
  const chatbotRun = () => {
    const url = 'http://localhost:8501';  // ✨ 수정: 'http://' 붙여주고 포트번호 8501로!
    const features = 'width=800,height=600,resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no';
    window.open(url, 'Daoni', features);
  }

  return (
    <>
      <div
        style={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid #eee',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Daon Groupware</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
          <IconButton icon={<MessageIcon />} onClick={msgRun} size="sm" appearance="subtle" title="메신저" />
          <IconButton icon={<EmailIcon />} onClick={emailRun} size="sm" appearance="subtle" title="이메일" />
          <IconButton icon={<WechatOutlineIcon />} onClick={chatbotRun} size="sm" appearance="subtle" title="챗봇" />

          <Avatar
            circle
            size="sm"
            src={imageUrl}
            alt="프로필"
            onClick={() => setShowModal(true)}
            style={{ cursor: 'pointer' }}
            onError={(e) => { e.target.src = '/default-profile.png'; }}
          />
          <span
            style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
            onClick={() => setShowModal(true)}
          >
            {empName ?? '사용자'}
          </span>
          <IconButton
            icon={<ExitIcon />}
            appearance="subtle"
            size="sm"
            onClick={logout}
            title="로그아웃"
          />
        </div>
      </div>

      <ProfileEditModal
        show={showModal}
        onClose={() => setShowModal(false)}
        empNo={user?.emp_no}
        onSuccess={() => {
          loadEmployeeInfo();                // 헤더 갱신
          onProfileUpdated?.();              // Rightbar 트리거
          setShowModal(false);
        }}
      />
    </>
  );
};

export default Header;
