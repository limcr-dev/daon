import React from 'react';
import {
  Sidebar,
  Sidenav,
} from 'rsuite';
import Profile from '../components/rightbar/Profile';
import Plan from '../components/rightbar/Plan';


const Rightbar = () => {
  return(
    <Sidebar
      style={{ display: 'flex', flexDirection: 'column' }}
      collapsible
    >
      <Sidenav.Header>
        <Profile/>
      </Sidenav.Header>
      
      <Sidenav>
        <Sidenav.Body>
          <Plan/>
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};

export default Rightbar;
