import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { addNotoSansKR } from "../../font/NotoSansKR";

export const generateSalaryPdf = (data, salaryMonth) => {
  const doc = new jsPDF();

  // ✅ 한글 폰트 등록 및 설정
  addNotoSansKR(doc);
  doc.setFont("NotoSansKR");

  // 제목
  doc.setFontSize(16);
  doc.text(`급여 명세서 (${salaryMonth})`, 14, 20);

  doc.setFontSize(10);
  doc.text(`회사명: (주)다온`, 160, 15);
  doc.text(`지급일: ${data.payment_date || "2025-04-30"}`, 160, 21);
  // 기본 정보
  doc.setFontSize(12);
  doc.text(`사원명: ${data.emp_name}`, 14, 30);
  doc.text(`부서: ${data.dept_name}`, 14, 37);
  doc.text(`직급: ${data.position_name}`, 14, 44);
  doc.text(`기본급: ${data.base_pay.toLocaleString()} 원`, 14, 51);

  // ✅ 수당 항목 테이블
  const allowanceRows = data.allowances.map(a => [a.name, `${a.amount.toLocaleString()} 원`]);
  autoTable(doc, {
    head: [["수당 항목", "금액"]],
    body: allowanceRows,
    startY: 60,
    styles: {
      font: "NotoSansKR",
      fontStyle: "normal",
      fontSize: 10,
      halign: "center", // ✅ 본문 가운데 정렬 추가
    },
    headStyles: {
      font: "NotoSansKR",
      fontStyle: "normal",
      fontSize: 10,
      halign: "center",
      fillColor: [0, 112, 192],  // 파란 배경
      textColor: 255             // 흰색 글자
    },
  });

  // ✅ 공제 항목 테이블
  const deductionRows = data.deductions.map(d => [d.name, `${d.amount.toLocaleString()} 원`]);
  const deductionStartY = doc.lastAutoTable.finalY + 10;
  autoTable(doc, {
    head: [["공제 항목", "금액"]],
    body: deductionRows,
    startY: deductionStartY,
    styles: {
      font: "NotoSansKR",
      fontStyle: "normal",
      fontSize: 10,
      halign: "center", // ✅ 본문 가운데 정렬 추가
    },
    headStyles: {
      font: "NotoSansKR",
      fontStyle: "normal",
      fontSize: 10,
      halign: "center",
      fillColor: [0, 112, 192],
      textColor: 255
    },
  });

  
  
  // ✅ 총계 2열 테이블로 출력
const summaryRows = [
  ["총 수당", `${data.total_allowance.toLocaleString()} 원`],
  ["총 공제", `${data.total_deduction.toLocaleString()} 원`],
  ["소득세", `${data.income_tax?.toLocaleString() ?? "0"} 원`],
  ["지방소득세", `${data.local_tax?.toLocaleString() ?? "0"} 원`],
];

const summaryStartY = doc.lastAutoTable.finalY + 10;

autoTable(doc, {
  head: [["항목명", "금액"]],
  body: summaryRows,
  startY: summaryStartY,
  styles: {
    font: "NotoSansKR",
    fontStyle: "normal",
    fontSize: 10,
    halign: "center",
  },
  headStyles: {
    font: "NotoSansKR",
    fontStyle: "normal",
    fontSize: 10,
    halign: "center",
    fillColor: [0, 112, 192],
    textColor: 255
  },
});
const totalStartY = doc.lastAutoTable.finalY + 10;
doc.text(`실수령액: ${data.actual_pay.toLocaleString()} 원`, 14, totalStartY + 30);




  // 저장
  doc.save(`급여명세서_${data.emp_name}_${salaryMonth}.pdf`);
};
