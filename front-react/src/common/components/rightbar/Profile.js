import { Card, Text, Avatar, HStack, VStack } from 'rsuite';
import Attendance from './Attendance';

const Profile = () => {
  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <Card 
        style={{ width: '300px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} 
        shaded
      >
        <Card.Header 
          style={{
            textAlign: 'center', 
            padding: '15px', 
            backgroundColor: '#f5f5f5', 
            borderTopLeftRadius: '15px', 
            borderTopRightRadius: '15px'
          }}
        >
          <HStack justifyContent="center">
            <Avatar circle src="https://i.pravatar.cc/150?u=9" size="lg" />
            <VStack spacing={2}>
              <Text style={{ fontWeight: '600', fontSize: '16px' }}>John Doe</Text>
              <Text muted size="sm" style={{ fontSize: '14px' }}>
                대표 이사
              </Text>
            </VStack>
          </HStack>
        </Card.Header>
        <Card.Body style={{ padding: '1px', textAlign: 'center' }}>
          <Attendance/>
        </Card.Body>
        <Card.Footer 
          style={{
            textAlign: 'center', 
            padding: '10px', 
            backgroundColor: '#f5f5f5', 
            borderBottomLeftRadius: '15px', 
            borderBottomRightRadius: '15px'
          }}
        >
          <Text muted size="sm">Joined in January 2023</Text>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Profile;
