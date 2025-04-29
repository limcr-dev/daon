
import React from "react";
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, RadarChart, Radar } from "recharts";

const PentagonChart = ({ data }) => {

    return (
        <div>
            {data.length > 0 ? (
                data.map((person, index) => (
                    <div key={person.eval_order_num} style={{ marginBottom: '20px' }}>
                        < ResponsiveContainer width="80%" height={250} >
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={person.scores}>
                                <PolarGrid /> {/* 바탕격자 */}
                                <PolarAngleAxis dataKey="subject" />  {/* 꼭짓점 */}
                                <PolarRadiusAxis /> {/* 거리(점수)스케일 */}
                                <Radar name="역량 점수" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                        <div style={{ marginTop: '8px', fontSize: '14px', color: '#333' }}>
                        {person.chartTitle || `평가일: ${person.eval_test_date}`}
                        </div>
                    </div>
                ))
            ) : (
                <div>데이터가 없습니다.</div>
            )
            }
        </div >

    );
};
export default PentagonChart;