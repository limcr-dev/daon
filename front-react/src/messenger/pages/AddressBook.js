import SearchIcon from '@rsuite/icons/Search';
// import React, { useEffect, useState } from 'react';
import {
  Container,
  Input,
  InputGroup,
} from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import MessengerLeftbar from './MessengerLeftbar';

const styles = {
  width: 300,
  marginBottom: 0
};

const AddressBook = () => {
  //  const [addressBook, setaddressBook] = useState([]);

  //   useEffect(() => {
  //     fetch("http://localhost:8081/messenger/addressBook"
  //       , {
  //         method: "Get"
  //       }).then(res => res.json() 
  //       ).then(data => {
  //         setaddressBook(data);
  //       })

  //   }, []);
  return (
    <div>
      <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar />
        <div style={{ display: 'flex', maxHeight: '35px' }}>
          <MessengerLeftbar />

          <InputGroup inside style={styles}>
            <Input placeholder='이름/이메일 입력' />

            <InputGroup.Button>
              <SearchIcon />
            </InputGroup.Button>
          </InputGroup>
        </div>
      </Container>
      <img src="/image/chat_list.jpg" alt="Daon" style={{ width: '300px', height: 'auto' }} />
    </div>
  );
};
export default AddressBook;