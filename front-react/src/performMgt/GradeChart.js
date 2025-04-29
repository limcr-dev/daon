
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const COLORS = {
    S: "#FFD700",
    A: "#4CAF50",
    B: "#2196F3",
    C: "#FF9800",
    D: "#FF5722",
    F: "#9E9E9E",
  };
  
  const GradeChart = ({ data }) => {
    return (
      <ResponsiveContainer width="80%" height={200}>
        <BarChart data={data} barCategoryGap="40%">
          <XAxis dataKey="name" />
          <YAxis hide />
          <Tooltip />
          <Legend />
          {Object.keys(COLORS).map((grade) => (
            <Bar key={grade} dataKey={grade} stackId="a" fill={COLORS[grade]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

export default GradeChart;