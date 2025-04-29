import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { request } from '../../common/components/helpers/axios_helper';

function FileUpload({ onFileUpload, initialFileName }) {

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');

    useEffect(() => {
        if (initialFileName) {
            setUploadedFileName(initialFileName);
        }
    }, [initialFileName]);

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

        request('post', '/api/s3/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then((response) => {
                alert('파일 업로드에 성공하였습니다.');
                const savedFileName = response.data;
                setUploadedFileName(savedFileName);
                onFileUpload(savedFileName);
            })
            .catch((error) => {
                alert('파일 업로드에 실패하였습니다.');
                console.error('파일 업로드 오류:', error);
            });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>파일 업로드</button>
            </div>
            {uploadedFileName && (
                <div>
                    <strong>첨부 파일:</strong>&nbsp;
                    {uploadedFileName.includes('_')
                        ? decodeURIComponent(uploadedFileName.substring(uploadedFileName.indexOf('_') + 1))
                        : uploadedFileName}
                </div>
            )}
        </div>
    );
}

export default FileUpload;

