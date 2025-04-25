import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportSalarySummaryToExcel = (data, salaryMonth) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "급여요약");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(blob, `급여요약_${salaryMonth}.xlsx`);
};
