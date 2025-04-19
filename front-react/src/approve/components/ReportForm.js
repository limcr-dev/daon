import React, { useState } from 'react';

const ReportForm = () => {
    // 업무 보고서 상태 관리
    const [reportForm, setReportForm] = useState({
        title: '',
        reportDate: '',
        department: '',
        reporter: '',
        reportType: '일일',
        completedTasks: '',
        inProgressTasks: '',
        pendingTasks: '',
        issues: '',
        nextPlan: '',
        attachments: null
    });

    // 입력 필드 변경 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportForm({
            ...reportForm,
            [name]: value
        });
    };

    // 파일 업로드 처리
    const handleFileChange = (e) => {
        setReportForm({
            ...reportForm,
            attachments: e.target.files
        });
    };

    // 결재 제출 처리
    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기에 결재 제출 로직 구현
        console.log('제출된 업무 보고서:', reportForm);
        // API 호출 등의 로직이 들어갈 수 있습니다
    };

    return (
        <div className="report-approval-form">
            <h2>업무 보고서</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>제목</label>
                    <input 
                        type="text" 
                        name="title"
                        value={reportForm.title}
                        onChange={handleInputChange}
                        placeholder="업무 보고서 제목을 입력해주세요"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>보고 일자</label>
                    <input 
                        type="date" 
                        name="reportDate"
                        value={reportForm.reportDate}
                        onChange={handleInputChange}
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>부서</label>
                    <input 
                        type="text" 
                        name="department"
                        value={reportForm.department}
                        onChange={handleInputChange}
                        placeholder="부서명을 입력해주세요"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>보고자</label>
                    <input 
                        type="text" 
                        name="reporter"
                        value={reportForm.reporter}
                        onChange={handleInputChange}
                        placeholder="보고자 이름을 입력해주세요"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>보고서 종류</label>
                    <select 
                        name="reportType" 
                        value={reportForm.reportType}
                        onChange={handleInputChange}
                    >
                        <option value="일일">일일 보고서</option>
                        <option value="주간">주간 보고서</option>
                        <option value="월간">월간 보고서</option>
                        <option value="프로젝트">프로젝트 보고서</option>
                        <option value="특별">특별 보고서</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>완료된 업무</label>
                    <textarea 
                        name="completedTasks"
                        value={reportForm.completedTasks}
                        onChange={handleInputChange}
                        placeholder="완료된 업무를 상세히 기술해주세요"
                        rows="3"
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label>진행 중인 업무</label>
                    <textarea 
                        name="inProgressTasks"
                        value={reportForm.inProgressTasks}
                        onChange={handleInputChange}
                        placeholder="현재 진행 중인 업무를 기술해주세요"
                        rows="3"
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label>대기 중인 업무</label>
                    <textarea 
                        name="pendingTasks"
                        value={reportForm.pendingTasks}
                        onChange={handleInputChange}
                        placeholder="아직 착수하지 못한 업무를 기술해주세요"
                        rows="3"
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label>문제점 및 애로사항</label>
                    <textarea 
                        name="issues"
                        value={reportForm.issues}
                        onChange={handleInputChange}
                        placeholder="업무 수행 중 발생한 문제점이나 애로사항을 기술해주세요"
                        rows="3"
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label>향후 계획</label>
                    <textarea 
                        name="nextPlan"
                        value={reportForm.nextPlan}
                        onChange={handleInputChange}
                        placeholder="향후 업무 계획을 기술해주세요"
                        rows="3"
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label>첨부 파일</label>
                    <input 
                        type="file" 
                        name="attachments"
                        onChange={handleFileChange}
                        multiple
                    />
                    <small>관련 자료가 있으면 첨부해주세요</small>
                </div>
                
                <div className="approval-line">
                    <h3>결재선</h3>
                    <div className="approvers">
                        <div className="approver">
                            <span>1차 결재자</span>
                            <input type="text" placeholder="팀장" readOnly />
                        </div>
                        <div className="approver">
                            <span>2차 결재자</span>
                            <input type="text" placeholder="부서장" readOnly />
                        </div>
                    </div>
                </div>
                
                <div className="form-buttons">
                    <button type="submit" className="submit-btn">결재 요청</button>
                    <button type="button" className="cancel-btn">취소</button>
                </div>
            </form>
        </div>
    );
};

export default ReportForm;