import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Salary from './pages/Salary';
import AllowanceList from './pages/Allowance/AllowanceList';
import DeductionList from './pages/Deduction/DeductionList';
import EmployeeItemConfig from './pages/EmployeeItem/EmployeeItemConfig';
import EmployeeSalaryList from './pages/EmployeeSalaryList/EmployeeSalaryList ';
import SalarySchedule from './pages/SalarySchedule/SalarySchedule';

const SalaryRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Salary/>} />
            <Route path="/allowanceList" element={<AllowanceList/>} /> 
            <Route path="/deductionList" element={<DeductionList/>} />
            <Route path="/employeeItemConfig" element={<EmployeeItemConfig/>} />
            <Route path="/employeeSalaryList" element={<EmployeeSalaryList/>} />
            <Route path="/salarySchedule" element={<SalarySchedule/>} />
        </Routes>
    );
};

export default SalaryRouter;