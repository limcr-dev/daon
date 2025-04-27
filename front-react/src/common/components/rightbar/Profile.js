import React, { useEffect, useState } from 'react';
import { Card, Text, Avatar, HStack, VStack } from 'rsuite';
import Attendance from './Attendance';
import { getPositionName, getDeptName } from "../../../hrMgt/components/getEmployeeInfo";
import { useUser } from '../../../common/contexts/UserContext';
import { request } from '../../../common/components/helpers/axios_helper';

const Profile = ({ reloadTrigger }) => {
  const { user } = useUser();
  const [empData, setEmpData] = useState(null);

  // ✅ reloadTrigger가 변경될 때마다 다시 조회
  useEffect(() => {
    if (user?.emp_no) {
      request("get", `/api/employee/${user.emp_no}`)
        .then((res) => setEmpData(res.data))
        .catch((err) => console.error("사원 정보 조회 실패:", err));
    }
  }, [user, reloadTrigger]);

  if (!empData) {
    return <div style={{ textAlign: 'center', paddingTop: '40px' }}>로딩 중...</div>;
  }

  const { emp_name, emp_img, emp_no, position_id, dept_no } = empData;

  const imageUrl = emp_img
    ? `http://localhost:8081/api/images/${encodeURIComponent(emp_img)}`
    : '/default-profile.png';

  return (
    <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
      <Card
        shaded
        style={{
          width: 300,
          borderRadius: 15,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Card.Header
          style={{
            textAlign: 'center',
            padding: 15,
            backgroundColor: '#f5f5f5',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        >
          <HStack justifyContent="center" spacing={10}>
            <Avatar
              circle
              size="lg"
              src={imageUrl}
              alt={`${emp_name} 프로필`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-profile.png';
              }}
            />
            <VStack spacing={2}>
              <Text style={{ fontWeight: 600, fontSize: 16 }}>{emp_name}</Text>
              <Text muted size="sm" style={{ fontSize: 14 }}>
                {getPositionName(position_id) || '직급 없음'}
              </Text>
              <Text muted size="sm" style={{ fontSize: 13 }}>
                {getDeptName(dept_no) || '부서 없음'}
              </Text>
            </VStack>
          </HStack>
        </Card.Header>

        <Card.Body style={{ padding: 1, textAlign: 'center' }}>
          <Attendance />
        </Card.Body>

        <Card.Footer
          style={{
            textAlign: 'center',
            padding: 10,
            backgroundColor: '#f5f5f5',
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <Text muted size="sm">사번: {emp_no}</Text>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Profile;
