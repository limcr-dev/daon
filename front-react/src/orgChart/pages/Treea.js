import React, { useEffect, useState } from "react";
import { Tree } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { getPositionName } from "../../hrMgt/components/getEmployeeInfo.js"
// 직급 코드 → 직급명 변환 함수


const Treea = () => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/organization")
      .then((response) => response.json())
      .then((data) => setTreeData(transformToTree(data)))
      .catch((error) => console.error("Error fetching organization data:", error));
  }, []);

  const transformToTree = (departments) => {
    const deptMap = {};

    // 부서 정보 매핑
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

      // 직원 추가 (직급명을 표시하도록 수정)
      if (dept.employees && dept.employees.length > 0) {
        dept.employees.forEach(emp => {
          deptNode.children.push({
            value: emp.emp_no,
            label: `${emp.emp_name} (${getPositionName(emp.position_id)})` // 숫자 → 직급명 변환!
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
  };

  return (
    <div>
      <h3>조직도</h3>
      <Tree data={treeData} showIndentLine defaultExpandAll />
       
    </div>
  );
};

export default Treea;
