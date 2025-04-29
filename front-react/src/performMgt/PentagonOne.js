
import React from "react";
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, RadarChart, Radar } from "recharts";

const PentagonOne = ({ data }) => {

    return (

        <div style={{ marginBottom: '5px', fontSize: '12px'}}>
            <ResponsiveContainer width="100%" height={180}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.scores}>
                    <PolarGrid /> {/* 바탕격자 */}
                    <PolarAngleAxis dataKey="subject" /> {/* 꼭짓점 */}
                    <PolarRadiusAxis /> {/* 거리(점수) 스케일 */}
                    <Radar
                        name="역량 점수"
                        dataKey="score"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                    />
                </RadarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '2px', fontSize: '14px', color: '#333', textAlign: 'center' }}>
                {data.chartTitle || `평가일: ${data.eval_test_date}`}
            </div>
        </div>


    );
};
export default PentagonOne;