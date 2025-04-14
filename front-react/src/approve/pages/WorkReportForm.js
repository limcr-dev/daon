import React, { useState } from 'react';
import { Form, DatePicker, Input, Button } from 'rsuite';
//import ReactQuill from 'react-quill'; // 리치 텍스트 에디터
//import 'react-quill/dist/quill.snow.css'; // 에디터 스타일
import '../css/workReportForm.css';

const WorkReportForm = () => {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const [reportDate, setReportDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('본문');
  
  // 에디터 툴바 설정
  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="form-container">
      <h2 className="form-title">업무기안</h2>
      
      <div className="form-content">
        {/* 상단 정보 테이블 */}
        <div className="form-header">
          <table className="header-table">
            <tbody>
              <tr>
                <td className="label-cell">기안자</td>
                <td>김지연</td>
              </tr>
              <tr>
                <td className="label-cell">소속</td>
                <td>영업팀</td>
              </tr>
              <tr>
                <td className="label-cell">기안일</td>
                <td>{formattedDate}(금)</td>
              </tr>
              <tr>
                <td className="label-cell">문서번호</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          
          {/* 결재라인 테이블 */}
          <table className="approval-table">
            <tbody>
              <tr>
                <td rowSpan="3" className="approval-position">결재</td>
                <td className="approval-header">부장</td>
                <td className="approval-header">부문장</td>
                <td className="approval-header">대표</td>
              </tr>
              <tr className="approver-row">
                <td className="approval-name">김지연</td>
                <td className="approval-name">마무무</td>
                <td className="approval-name">고관비</td>
              </tr>
              <tr className="sign-row">
                <td className="approval-sign"></td>
                <td className="approval-sign"></td>
                <td className="approval-sign"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* 문서 정보 테이블 */}
        <table className="info-table">
          <tbody>
            <tr>
              <td className="label-cell">시행일자</td>
              <td>
                <div className="date-input">
                  <img src="/calendar-icon.png" alt="달력" className="calendar-icon" />
                  <DatePicker type="date" defaultValue="2025-04-15" />
                </div>
              </td>
              <td className="label-cell">협조부서</td>
              <td></td>
            </tr>
            <tr>
              <td className="label-cell">협의</td>
              <td colSpan="3">
                <input type="text" className="full-width-input" />
              </td>
            </tr>
            <tr>
              <td className="label-cell">제목</td>
              <td colSpan="3">
                <input 
                  type="text" 
                  className="full-width-input" 
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* 에디터 탭 */}
        <div className="editor-tabs">
          <div 
            className={`editor-tab ${activeTab === '본문' ? 'active' : ''}`}
            onClick={() => setActiveTab('본문')}
          >
            본문
          </div>
          <div 
            className={`editor-tab ${activeTab === 'HTML' ? 'active' : ''}`}
            onClick={() => setActiveTab('HTML')}
          >
            HTML
          </div>
        </div>
        
        {/* 에디터 툴바 */}
        <div className="editor-toolbar">
          <div className="toolbar-btn-group">
            <button className="toolbar-btn"><span role="img" aria-label="bold">B</span></button>
            <button className="toolbar-btn"><span role="img" aria-label="italic">I</span></button>
            <button className="toolbar-btn"><span role="img" aria-label="underline">U</span></button>
            <button className="toolbar-btn"><span role="img" aria-label="strikethrough">S</span></button>
          </div>
          <div className="toolbar-separator"></div>
          <div className="toolbar-select">
            <select>
              <option>기본서체</option>
            </select>
          </div>
          <div className="toolbar-select">
            <select>
              <option>10pt</option>
            </select>
          </div>
          <div className="toolbar-separator"></div>
          <div className="toolbar-btn-group">
            <button className="toolbar-btn"><span role="img" aria-label="align-left">⁝⁝</span></button>
            <button className="toolbar-btn"><span role="img" aria-label="align-center">≡</span></button>
            <button className="toolbar-btn"><span role="img" aria-label="align-right">⁝⁝</span></button>
          </div>
        </div>
        
        {/* 에디터 본문 */}
        <div className="editor-content">
          {/* <ReactQuill 
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="내용을 입력하세요."
          /> */}
        </div>
        
        {/* 첨부파일 및 관련 문서 */}
        <div className="form-footer">
          <div className="attachment-section">
            <h3>파일첨부</h3>
            <div className="attachment-box">
              <div className="attachment-placeholder">
                <img src="/paperclip-icon.png" alt="첨부" className="attachment-icon" />
                <span>이 곳에 파일을 드래그 하세요. 또는 파일첨부</span>
              </div>
            </div>
          </div>
          
          <div className="related-docs">
            <h3>관련문서</h3>
            <button className="related-docs-btn">문서 검색</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkReportForm;