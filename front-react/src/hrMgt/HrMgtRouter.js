import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Employee from './pages/Employee';
import EmployeeList from './pages/EmployeeList';
import EmployeeDetail from './pages/EmployeeDetail';
import DepartmentRoleManage from './pages/DepartmentRole/DepartmentRoleManage';
import AdminRoleManage from './pages/AdminRoleManage';
import EmployeeResignPage from './pages/EmployeeResignPage';
import PositionManage from './pages/Position/PositionManage';
import ContractEmployeeManage from './pages/ContractEmployeeManage/ContractEmployeeManage';

const HrMgtRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Employee />} /> 
            <Route path="/employeeList" element={<EmployeeList />} />
            <Route path="/:emp_no" element={<EmployeeDetail/>} />
            <Route path="/contractEmployeeManage" element={<ContractEmployeeManage/>} />
            <Route path="/positionManage" element={<PositionManage/>} />
            <Route path="/departmentRoleManage" element={<DepartmentRoleManage/>} />
            <Route path="/adminRoleManage" element={<AdminRoleManage/>} />
            <Route path="/employeeResignPage" element={<EmployeeResignPage/>}/>
        </Routes>
    )
};
export default HrMgtRouter;