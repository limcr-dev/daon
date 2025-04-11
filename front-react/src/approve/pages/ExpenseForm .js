import React, { useState } from 'react';

const ExpenseForm = () => {
    // 지출 결의서 상태 관리
    const [expenseForm, setExpenseForm] = useState({
        title: '',
        expenseDate: '',
        amount: '',
        category: '업무비',
        paymentMethod: '카드',
        accountInfo: '',
        details: '',
        attachments: null
    });

    // 입력 필드 변경 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExpenseForm({
            ...expenseForm,
            [name]: value
        });
    };

    // 파일 업로드 처리
    const handleFileChange = (e) => {
        setExpenseForm({
            ...expenseForm,
            attachments: e.target.files
        });
    };

    // 결재 제출 처리
    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기에 결재 제출 로직 구현
        console.log('제출된 지출 결의서:', expenseForm);
        // API 호출 등의 로직이 들어갈 수 있습니다
    };

    return (
        <div className="expense-approval-form">
            <h2>지출 결의서</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>제목</label>
                    <input 
                        type="text" 
                        name="title"
                        value={expenseForm.title}
                        onChange={handleInputChange}
                        placeholder="지출 결의서 제목을 입력해주세요"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>지출 일자</label>
                    <input 
                        type="date" 
                        name="expenseDate"
                        value={expenseForm.expenseDate}
                        onChange={handleInputChange}
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>지출 금액</label>
                    <input 
                        type="number" 
                        name="amount"
                        value={expenseForm.amount}
                        onChange={handleInputChange}
                        placeholder="금액을 입력해주세요"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>지출 분류</label>
                    <select 
                        name="category" 
                        value={expenseForm.category}
                        onChange={handleInputChange}
                    >
                        <option value="업무비">업무비</option>
                        <option value="회의비">회의비</option>
                        <option value="교통비">교통비</option>
                        <option value="식대">식대</option>
                        <option value="접대비">접대비</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>지불 방법</label>
                    <select 
                        name="paymentMethod" 
                        value={expenseForm.paymentMethod}
                        onChange={handleInputChange}
                    >
                        <option value="카드">법인카드</option>
                        <option value="현금">현금</option>
                        <option value="계좌이체">계좌이체</option>
                        <option value="개인카드">개인카드</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>계좌 정보</label>
                    <input 
                        type="text" 
                        name="accountInfo"
                        value={expenseForm.accountInfo}
                        onChange={handleInputChange}
                        placeholder="환급받을 계좌 정보를 입력해주세요"
                    />
                </div>
                
                <div className="form-group">
                    <label>상세 내역</label>
                    <textarea 
                        name="details"
                        value={expenseForm.details}
                        onChange={handleInputChange}
                        placeholder="지출에 대한 상세 내역을 입력해주세요"
                        rows="4"
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label>증빙 자료</label>
                    <input 
                        type="file" 
                        name="attachments"
                        onChange={handleFileChange}
                        multiple
                    />
                    <small>영수증, 인보이스 등의 증빙 서류를 첨부해주세요</small>
                </div>
                
                <div className="approval-line">
                    <h3>결재선</h3>
                    <div className="approvers">
                        <div className="approver">
                            <span>1차 결재자</span>
                            <input type="text" placeholder="부서장" readOnly />
                        </div>
                        <div className="approver">
                            <span>2차 결재자</span>
                            <input type="text" placeholder="경리팀장" readOnly />
                        </div>
                        <div className="approver">
                            <span>최종 결재자</span>
                            <input type="text" placeholder="재무이사" readOnly />
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

export default ExpenseForm;