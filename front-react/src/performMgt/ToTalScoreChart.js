
import React from "react";
import{Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart } from "recharts";

const ToTalScoreChart = ({ data }) => {

    return (
        <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="eval_test_date" label={{  position: 'insideBottomRight', offset: 0 }} />
          <YAxis label={{ value: '총점', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="avg_total" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
  

    );
};
export default ToTalScoreChart;