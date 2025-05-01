import React, { useEffect, useState } from 'react';
import { Button, Tree } from 'rsuite';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';
import { useUser } from '../../common/contexts/UserContext';
import '../css/approve.css'
import { getApprStatusText } from './ApprCodeToText';
import { request } from '../../common/components/helpers/axios_helper';

const ApproveLine = ({ closeModal, onSave, approveLine = [] }) => {

    const { user } = useUser(); // 결재 요청자 정보
    const [line, setLine] = useState(approveLine);   // 결재 라인 정보
    const [approver, setApprover] = useState(null); // 선택된 직원 정보
    const applicant = {
        appr_no: user.emp_no,
        appr_name: user.emp_name,
        appr_position: getPositionName(user.position_id),
        appr_dept_name: getDeptName(user.dept_no),
        appr_dept_no: user.dept_no,
        appr_status: 0,
        appr_type: '기안자'
    };

    const [deptTree, setDeptTree] = useState([]); // 조직도 정보

    // 조직도 불러오기
    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                const response = await request('get', '/api/organization');
                setDeptTree(transformToTree(response.data));
            } catch (error) {
                console.error("조직도 불러오기 에러:", error);
            }
        };

        fetchOrganization();
    }, []);

    // 신청자 결재선 제일 첫번째에 넣기
    useEffect(() => {
        // 이미 approveLine이 있으면 그대로 사용
        if (approveLine && approveLine.length > 0) { return; }

        // line이 비어있을 때만 초기화
        if (line.length === 0 && user && user.emp_no) { setLine([applicant]); }

    }, [approveLine, user]);

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
                appr_no: selectedLabel.value,
                appr_name: selectedLabel.emp_data.emp_name,
                appr_position: getPositionName(selectedLabel.emp_data.position_id),
                appr_dept_name: selectedLabel.dept_data.dept_name,
                appr_dept_no: selectedLabel.dept_data.dept_no,
                appr_status: line.length === 1 ? 2 : 1,
                appr_type: '결재자'
            })
            console.log(approver);
        } else {
            setApprover(null);
        }
    }

    const addToLine = () => {
        // 선택된 직원이 없는 경우
        if (!approver) {
            alert("결재 라인에 추가할 직원을 선택해주세요.");
            return;
        }

        // 첫 번째 인덱스는 항상 신청자(기안자)
        if (line.length > 0) {
            // 신청자와 동일한 사람인지 확인 (첫 번째 항목이 신청자)
            if (line[0] && line[0].appr_no === approver.appr_no) {
                alert("결재 라인에 작성자는 추가할 수 없습니다.");
                return;
            }

            // 이미 승인자로 추가된 직원인지 확인
            const alreadyAdded = line.some(emp => emp.appr_no === approver.appr_no);
            if (alreadyAdded) {
                alert("이미 결재 라인에 추가된 직원입니다.");
                return;
            }

            // 최대 4명까지 가능 (신청자 1명 + 승인자 3명)
            if (line.length >= 4) {
                alert("결재 라인에는 승인자를 3명까지만 추가할 수 있습니다.");
                return;
            }

            // 모든 검증을 통과하면 결재선에 추가
            const newApprover = {
                ...approver,
                appr_type: '결재자'  // 타입 명시적으로 설정
            };

            setLine([...line, newApprover]);
        } else {
            // line이 비어있는 경우는 처리하지 않음 (첫 번째 항목은 항상 신청자여야 함)
            alert("결재 라인 초기화에 문제가 있습니다. 새로고침 후 다시 시도해주세요.");
        }
    };

    // 결재선 직원 삭제
    const removeFromLine = (appr_no) => {
        setLine(line.filter(emp => emp.appr_no !== appr_no));
    }

    const handleSave = () => {
        if (onSave) {
            onSave(line);
        }
        closeModal();
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                {/* 왼쪽 패널 - 조직도/나의 결재선 */}
                <div style={{ width: '30%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e0e0e0', overflow: 'hidden' }}>
                    
                    <div style={{ flex: 1, overflow: 'hidden' }}>
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
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}></th>
                                <th style={{ width: '15%' }}>타입</th>
                                <th style={{ width: '25%' }}>이름</th>
                                <th style={{ width: '30%' }}>부서</th>
                                <th style={{ width: '20%' }}>결재 상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th colSpan={5}>신청</th>
                            </tr>
                            <tr>
                                <th style={{ width: '10%' }}></th>
                                <td>{applicant.appr_type}</td>
                                <td>{applicant.appr_name}</td>
                                <td>{getDeptName(applicant.appr_dept_no)}</td>
                                <td>{getApprStatusText(applicant.appr_status)}</td>
                            </tr>
                            <tr>
                                <th colSpan={5}>승인</th>
                            </tr>
                            {line.length > 1 ? (
                                line.slice(1).map((approver, index) => (
                                    <tr key={index}>
                                        <th>
                                            <Button
                                                appearance="subtle"
                                                size="xs"
                                                color="red"
                                                onClick={() => removeFromLine(approver.appr_no)}
                                            >
                                                X
                                            </Button>
                                        </th>
                                        <td>결재자</td>
                                        <td>{approver.appr_name}</td>
                                        <td>{getDeptName(approver.appr_dept_no)}</td>
                                        <td>{getApprStatusText(approver.appr_status)}</td>
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
                        </tbody>
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