import React, { useEffect, useState } from "react";
import { Tree } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { getPositionName } from "../../hrMgt/components/getEmployeeInfo.js";

const Treea = ({ onEmployeeSelect }) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/organization")
      .then((response) => response.json())
      .then((data) => setTreeData(transformToTree(data)))
      .catch((error) => console.error("조직도 불러오기 실패:", error));
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
      const node = deptMap[dept.dept_no];
      if (dept.employees && dept.employees.length > 0) {
        dept.employees.forEach(emp => {
          node.children.push({
            value: emp.emp_no,
            label: `${emp.emp_name} (${getPositionName(emp.position_id)})`,
            isEmployee: true
          });
        });
      }

      if (dept.dept_parent === null) {
        tree.push(node);
      } else {
        if (deptMap[dept.dept_parent]) {
          deptMap[dept.dept_parent].children.push(node);
        }
      }
    });

    return tree;
  };

  const handleSelect = (node) => {
    if (node.isEmployee && onEmployeeSelect) {
      onEmployeeSelect(node.value); // empNo를 부모에 전달
    }
  };

  return (
    <div>
      <Tree
        data={treeData}
        showIndentLine
        defaultExpandAll
        onSelect={handleSelect}
      />
    </div>
  );
};

export default Treea;
