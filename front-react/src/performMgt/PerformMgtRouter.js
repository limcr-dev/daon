import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PerfomeMgt from './pages/PerfomeMgt';
import EvalQue from './pages/EvalQue';
import EvalMgt from './pages/EvalMgt';
import CheckComp from './pages/CheckComp'

const PerformMgtRouter = () => {
    return (
        <Routes>
            <Route path="/" exact={true} element={<PerfomeMgt />} />   {/* 인사평가 */}
            <Route path="/evalque" exact={true} element={<EvalQue />} />   {/* 평가 */}
            <Route path="/eval_management" exact={true} element={<EvalMgt />} /> {/* 인사 관리*/}
            <Route path="/eval_mgnt" exact={true} element={<CheckComp />} />
        </Routes>
    );
};

export default PerformMgtRouter;


// <Route path="/performMgt/*" element={<PerformMgtRouter />} />
// import PerformMgtRouter from "./performMgt/PerformMgtRouter";