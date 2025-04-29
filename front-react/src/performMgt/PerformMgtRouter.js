import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PerfomeMgt from './pages/PerfomeMgt';
import CheckComp from './pages/CheckComp'
import EvalList from './pages/EvalList'
import TestList from './pages/sub/TestList'
import EvalSelQue from './pages/EvalSelQue';
import EvalPeerQue from './pages/EvalPeerQue';
import CompList from './pages/sub/CompList';
import QuesList from './pages/sub/QuesList';
import GoalForm from './GoalForm';
import PerEvalStatus from './pages/PerEvalStatus';
import EvalSelect from './EvalSelect';
import EvalDetail from './EvalDetail';

const PerformMgtRouter = () => {
    return (
        <Routes>
            <Route path="/" exact={true} element={<EvalSelect />} />   {/* 인사평가 */}
            <Route path="/perEvalStatus" exact={true} element={<PerEvalStatus />} />   {/* 평가 현황 */}
            <Route path="/selfQues" exact={true} element={<EvalSelQue />} />     {/* 자기평가 */}  
            <Route path="/peerQues" exact={true} element={<EvalPeerQue />} />  {/* 동료평가 */} 
            <Route path="/checkComp" exact={true} element={<CheckComp />} />  {/* 역량선택 */} 
            <Route path="/evalList" exact={true} element={<EvalList />} />  {/* 직원 평가 진행 리스트 */}
            <Route path="/evalList/:orderNum" exact={true} element={<EvalList />} />  {/* 직원 평가 진행 리스트 */}
            <Route path="/evaluation/detail/:emp_no" exact={true} element={<EvalDetail />} /> 
            <Route path="/goalForm" exact={true} element={<GoalForm />} />  {/* 목표설정 */}
            <Route path="/compList" exact={true} element={<CompList />} />  {/* 역량 리스트 */}
            <Route path="/quesList" exact={true} element={<QuesList />} />  {/* 질문 리스트 */}
            <Route path="/testList" exact={true} element={<TestList />} />  {/* 테스트리스트 */}
            <Route path="/evalSelect" exact={true} element={<EvalSelect />} />  {/* 평가조회 */}

        </Routes>
    );
};

export default PerformMgtRouter;
