import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const SalaryTrendChart = ({ rawMonthlyStats, selectedMonth }) => {
  const center = new Date(`${selectedMonth}-01`);
  const months = [];

  for (let i = -2; i <= 2; i++) {
    const temp = new Date(center);
    temp.setMonth(temp.getMonth() + i);
    const yyyyMM = temp.toISOString().slice(0, 7);
    months.push(yyyyMM);
  }

  const data = months.map(month => {
    const found = rawMonthlyStats.find(m => m.salary_month === month);
    return {
      month,
      totalPay: found ? Number(found.total_actual_pay || 0) : 0
    };
  });

  return (
    <div style={{ height: 300, marginTop: 30 }}>
      <h5>📈 월별 총 지급액 추이</h5>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <Tooltip formatter={(value) => `${Number(value).toLocaleString()} 원`} />
          <Line type="monotone" dataKey="totalPay" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryTrendChart;