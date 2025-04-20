// import jsPDF from "jspdf";
// import "jspdf-autotable"; // ✅ 2.5.1 버전에서는 이거 하나면 충분함

// export const generateSalaryPdf = (data, salaryMonth) => {
//   const doc = new jsPDF();

//   // 📌 타이틀 및 사원 기본 정보
//   doc.setFontSize(16);
//   doc.text(`급여 명세서 (${salaryMonth})`, 14, 20);

//   doc.setFontSize(12);
//   doc.text(`사원명: ${data.emp_name}`, 14, 30);
//   doc.text(`부서: ${data.dept_name}`, 14, 37);
//   doc.text(`직급: ${data.position_name}`, 14, 44);
//   doc.text(`기본급: ${data.base_pay.toLocaleString()} 원`, 14, 51);

//   // 📌 수당 테이블
//   const allowanceRows = data.allowances.map(a => [a.name, `${a.amount.toLocaleString()} 원`]);
//   doc.autoTable({
//     head: [["수당 항목", "금액"]],
//     body: allowanceRows,
//     startY: 60
//   });

//   // 📌 공제 테이블
//   const deductionRows = data.deductions.map(d => [d.name, `${d.amount.toLocaleString()} 원`]);
//   const deductionStartY = doc.lastAutoTable.finalY + 10;
//   doc.autoTable({
//     head: [["공제 항목", "금액"]],
//     body: deductionRows,
//     startY: deductionStartY
//   });

//   // 📌 총계 출력
//   const summaryStartY = doc.lastAutoTable.finalY + 10;
//   doc.text(`총 수당: ${data.total_allowance.toLocaleString()} 원`, 14, summaryStartY);
//   doc.text(`총 공제: ${data.total_deduction.toLocaleString()} 원`, 14, summaryStartY + 7);
//   doc.text(`실수령액: ${data.actual_pay.toLocaleString()} 원`, 14, summaryStartY + 14);

//   // 📄 저장
//   doc.save(`급여명세서_${data.emp_name}_${salaryMonth}.pdf`);
// };
