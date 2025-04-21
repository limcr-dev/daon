import React, { Children, useEffect, useState } from 'react';
import { Button, Radio, Tree } from 'rsuite';
import { IconButton } from 'rsuite';
import { FaTrash, FaArrowRight } from 'react-icons/fa';  // 아이콘
import ApprOrgChart from '../components/ApprOrgChart';
import { getPositionName } from '../../hrMgt/components/getEmployeeInfo';
import { useUser } from '../../common/contexts/UserContext';
import '../css/approve.css'

const ApproveLine = ({ closeModal, onSave, approveLine = []}) => {

    const { user } = useUser(); // 결재 요청자 정보
    const [line, setLine] = useState(approveLine);   // 결재 라인 정보
    const [approver, setApprover] = useState(null); // 선택된 직원 정보
    const [deptTree, setDeptTree] = useState([]); // 조직도 정보
    const [searchTerm, setSearchTerm] = useState('');   // 실시간 검색을 위한 변수
    const handleInputChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
    }

    // 조직도 불러오기
    useEffect(() => {
        fetch("http://localhost:8081/api/organization")
            .then((res) => res.json())
            .then((data) => setDeptTree(transformToTree(data)))
            .catch((error) => console.error("조직도 불러오기 에러:", error));
    }, []);

    const transformToTree = (departments) => {
        const deptMap = {};

        departments.forEach(dept => {
            deptMap[dept.dept_no] = {
                value: dept.dept_no,
                label: dept.dept_name,
                children: []
            };
        });

        const tree = [];

        departments.forEach(dept => {
            const deptNode = deptMap[dept.dept_no];

            // 직원 추가
            if (dept.employees && dept.employees.length > 0) {
                dept.employees.forEach(emp => {
                    deptNode.children.push({
                        value: emp.emp_no,
                        label: `${emp.emp_name} (${getPositionName(emp.position_id)})`,
                        emp_data: emp,
                        dept_data: dept
                    });
                });
            }

            // 부모 부서가 없으면 최상위 트리에 추가
            if (dept.dept_parent === null) {
                tree.push(deptNode);
            } else {
                // 부모 부서의 children 배열에 추가
                if (deptMap[dept.dept_parent]) {
                    deptMap[dept.dept_parent].children.push(deptNode);
                }
            }
        });

        return tree;
    }

    const handleSelect = (selectedLabel) => {
        if (selectedLabel && selectedLabel.emp_data) {
            setApprover({
                approver_no: selectedLabel.value,
                emp_name: selectedLabel.emp_data.emp_name,
                position: getPositionName(selectedLabel.emp_data.position_id),
                dept_name: selectedLabel.dept_data.dept_name,
                dept_no: selectedLabel.dept_data.dept_no,
                approval_status: 1
            })
            console.log(approver);
        } else {
            setApprover(null);
        }
    }

    const addToLine = () => {
        if (approver) {
            // 결재 라인이 비어있으면 바로 추가
            if (line.length === 0) {
                const newApprover = {
                    ...approver
                };
                setLine([newApprover]);

                // 결재라인은 최대 3명까지 지정 가능
            } else if (line.length < 3) {
                // some() : array에서 주어진 조건을 만족하는 요소가 있으면 true를 반환하는 함수
                // line이 비어있으면 오류 발생
                const alreadyAdded = line.some(emp => emp.approver_no === approver.approver_no);
                if (!alreadyAdded) {
                    const newApprover = {
                        ...approver
                    };

                    setLine([...line, newApprover]);

                } else {
                    alert("이미 결재 라인에 추가된 직원입니다.");
                }
            } else {
                alert("결재 라인에는 3명까지만 추가할 수 있습니다.");
            }
        } else {
            alert("결재 라인에 추가할 직원을 선택해주세요.")
        }
    }

    // 결재선 직원 삭제
    const removeFromLine = (approver_no) => {
        setLine(line.filter(emp => emp.approver_no !== approver_no));
    }
    
    const handleSave = () => {
        if(onSave){
            onSave(line);
        }
        closeModal();
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', fontFamily: 'Arial, sans-serif', height: '500px' }}>
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* 왼쪽 패널 - 조직도/나의 결재선 */}
                <div style={{ width: '30%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e0e0e0', overflow: 'hidden' }}>
                    <div style={{ padding: '10px' }}>
                        <input
                            type="text"
                            placeholder="이름으로 검색하세요"
                            value={searchTerm}
                            onChange={handleInputChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}> {/* 여기서 'auto'를 'hidden'으로 변경 */}
                        <Tree
                            data={deptTree}
                            showIndentLine
                            defaultExpandAll
                            onSelect={handleSelect}
                            style={{ overflow: 'hidden' }}
                        />
                    </div>
                    <div style={{ padding: '10px', borderTop: '1px solid #e0e0e0' }}>
                        <Button
                            appearance="primary"
                            block
                            onClick={addToLine}
                            disabled={!approver}
                        >
                            결재자 추가
                        </Button>
                    </div>
                </div>

                {/* 오른쪽 패널 - 선택된 결재자 */}
                <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
                    <table className='approve-table'>
                        <tr>
                            <th style={{ width: '10%' }}></th>
                            <th>타입</th>
                            <th>이름</th>
                            <th>부서</th>
                            <th>상태</th>
                        </tr>
                        <tr>
                            <th colSpan={5}>신청</th>
                        </tr>
                        <tr>
                            <th style={{ width: '10%' }}></th>
                            <td>기안</td>
                            <td>{user.emp_name}</td>
                            <td>{user.dept_no}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th colSpan={5}>승인</th>
                        </tr>
                        {line.length > 0 ? (
                            line.map((approver, index) => (
                                <tr key={index}>
                                    <th>
                                        <Button
                                            appearance="subtle"
                                            size="xs"
                                            color="red"
                                            onClick={() => removeFromLine(approver.approver_no)}
                                        >
                                            X
                                        </Button>
                                    </th>
                                    <td>{approver.type}</td>
                                    <td>{approver.emp_name}</td>
                                    <td>{approver.dept_name}</td>
                                    <td>{approver.approval_status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '10px' }}>
                                    선택된 결재자가 없습니다.
                                </td>
                            </tr>
                        )
                        }

                    </table>
                </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 10px', borderTop: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }}>
                <Button appearance="ghost" style={{ marginRight: '10px' }} onClick={closeModal}>
                    취소
                </Button>
                <Button appearance="primary" onClick={handleSave}>
                    확인
                </Button>
            </div>
        </div>
    );
};

export default ApproveLine;