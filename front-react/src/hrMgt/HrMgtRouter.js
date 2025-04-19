import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Employee from './pages/Employee';
import EmployeeDetail from './pages/EmployeeDetail';


const HrMgtRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Employee />} /> 
            <Route path="/:emp_no" element={<EmployeeDetail />} />
            {/* <Route path="/organizationChart" element={<OrganizationChart/>}/> */}
        </Routes>
    )
};

export default HrMgtRouter;