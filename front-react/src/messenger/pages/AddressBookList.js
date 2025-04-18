// import React, { useEffect, useState } from 'react';
// import Leftbar from '../../common/pages/Leftbar';
// import {
//     Container,
//     Content,
// } from 'rsuite';
// import MessengerLeftbar from './MessengerLeftbar';

// const AddressBookList = () => {

//     const [abList, setabList] = useState([]);

//     useEffect(() => {
//         fetch("http://localhost:8081/messenger/addressBookList", {
//             method: 'GET'
//         }).then(res => res.json()
//         ).then(data => {
//             console.log(1, data);
//             setabList(data);
//         })
//     }, []);

//     return (
//         // <div>
//         <Container style={{ minHeight: '100vh', width: '100%' }}>
//             <Leftbar />
//             <Container>
//                 <MessengerLeftbar />

//             <Content style={{ marginLeft: '15px', marginTop: '15px' }}>
//                 <Container>
//                     <table className='abList'>
//                         <tr>
//                             <th> 사번 </th>
//                             <th> 이름 </th>
//                             <th> 이메일 </th>
//                             <th> 부서 </th>
//                             <th> 직급 </th>
//                             <th> 사내번호 </th>
//                         </tr>
//                         {abList.map(employees => (
//                             <tr>
//                                 <td> {employees.emp_no} </td>
//                                 <td> {employees.emp_name} </td>
//                                 <td> {employees.emp_email} </td>
//                                 <td> {employees.dept_no} </td>
//                                 <td> {employees.position_id} </td>
//                                 <td> {employees.emp_ext_tel.slice(4, 9)} </td>
//                             </tr>
//                         ))}
//                     </table>
//                 </Container>
//             </Content>
//             </Container>
//         </Container>
//         // </div>
//     );
// };

// export default AddressBookList;