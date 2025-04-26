import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ onFileUpload }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        // FileUpload.js
        axios
            .post('http://localhost:8081/api/s3/upload', formData, {  // Spring Boot 서버 API 경로로 수정
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                alert('파일 업로드에 성공하였습니다.');
                const savedFileName = response.data; // ✅ UUID 붙은 파일명 받기
                onFileUpload(savedFileName);         // ✅ 부모 컴포넌트로 전달
                // onFileUpload(selectedFile.name);  // 업로드된 파일의 이름을 부모 컴포넌트로 전달
            })
            .catch((error) => {
                alert('파일 업로드를 실패하였습니다.');
                console.error('파일 업로드 오류:', error);
            });
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>파일 업로드</button>
        </div>
    );
}

export default FileUpload;

