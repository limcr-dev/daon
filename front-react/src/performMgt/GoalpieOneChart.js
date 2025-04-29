
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#8884d8', '#d3d3d3']; // 완료, 미완료 색

const GoalpieOneChart = ({ data }) => {

    if (!data || !Array.isArray(data)) {
        console.error("GoalpieChartForEval: 잘못된 데이터", data);
        return <div>데이터 없음</div>;
    }
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const completed = data.find(d => d.name === "완료")?.value || 0;
    const goalPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div style={{ textAlign: 'center', margin: '10px' }}>
            <h3 style={{color:"#8884d8"}}>{goalPercent}% 달성</h3>
            <PieChart width={250} height={200}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
            
            <h6>{total}건 중 {completed}건 완료</h6>
            <p>({new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })} 기준)</p>
            
        </div>
    );
};
export default GoalpieOneChart;