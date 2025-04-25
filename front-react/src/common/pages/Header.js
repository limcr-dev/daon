import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../common/contexts/UserContext';
import { Avatar, IconButton } from 'rsuite';
import ExitIcon from '@rsuite/icons/Exit';
import EmailIcon from '@rsuite/icons/Email';
import MessageIcon from '@rsuite/icons/Message';
import WechatOutlineIcon from '@rsuite/icons/WechatOutline';
import { request } from '../../common/components/helpers/axios_helper';
import ProfileEditModal from './ProfileEditModal';

const Header = () => {
  const { user, logout } = useUser();
  const [empImg, setEmpImg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ 프로필 이미지 로드 함수
  const loadProfileImage = useCallback(() => {
    if (user?.emp_no) {
      request("get", `/api/employee/${user.emp_no}`)
        .then((res) => {
          if (res.data.emp_img) {
            setEmpImg(res.data.emp_img);
          }
        })
        .catch((err) => {
          console.error("프로필 이미지 로딩 실패:", err);
        });
    }
  }, [user?.emp_no]);

  useEffect(() => {
    loadProfileImage();
  }, [loadProfileImage]);

  const imageUrl = empImg
    ? `http://localhost:8081/api/images/${encodeURIComponent(empImg)}`
    : '/default-profile.jpg';

  return (
    <div
      style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #eee',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      {/* ✅ 왼쪽 로고 */}
      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Daon Groupware</div>

      {/* ✅ 오른쪽 기능 영역 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
        {/* 🔘 기능 버튼들 */}
        <IconButton icon={<MessageIcon />} size="sm" appearance="subtle" title="메신저" onClick={() => alert('메신저 열기')} />
        <IconButton icon={<EmailIcon />} size="sm" appearance="subtle" title="이메일" onClick={() => alert('이메일 열기')} />
        <IconButton icon={<WechatOutlineIcon />} size="sm" appearance="subtle" title="챗봇" onClick={() => alert('챗봇 열기')} />
        

        {/* 🔘 프로필 이미지 + 이름 + 로그아웃 */}
        <Avatar
          circle
          size="sm"
          src={imageUrl}
          alt="프로필"
          onClick={() => setShowModal(true)}
          style={{ cursor: 'pointer' }}
          onError={(e) => { e.target.src = '/default-profile.jpg'; }}
        />
        <span
          style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
          onClick={() => setShowModal(true)}
        >
          {user?.emp_name ?? '사용자'}
        </span>
        <IconButton
          icon={<ExitIcon />}
          appearance="subtle"
          size="sm"
          onClick={logout}
          title="로그아웃"
        />
      </div>

      {/* ✅ 프로필 수정 모달 */}
      <ProfileEditModal
        show={showModal}
        onClose={() => setShowModal(false)}
        empNo={user?.emp_no}
        onSuccess={() => {
          loadProfileImage(); // 이미지 다시 불러오기
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default Header;
