
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#8884d8', '#d3d3d3']; // 완료, 미완료 색

const GoalpieChart = ({ data }) => {
    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
         
            <PieChart width={180} height={200}>
                <Pie
                    data={data.scores}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}  // 도넛 차트 스타일
                    outerRadius={80}
                    dataKey="value"
                    label
                >

                    {data.scores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}

                </Pie>
               
                <Tooltip />
            </PieChart>
            
            <h6>{data.goal_score}% 달성</h6>
            {data.goal_month}
        </div>
    );
};
export default GoalpieChart;