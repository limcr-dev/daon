import React from 'react';

const ColorLegend = () => {
    return (
        <div style={{ display: "flex" }}>
            <span style={{ color: "#49A902" }}>
                <span style={{ fontSize: "20px" }}>●</span> 정상&nbsp;
            </span>
            <span style={{ color: "#FF6B6B" }}>
                <span style={{ fontSize: "20px" }}>●</span> 지각&nbsp;
            </span>
            <span style={{ color: "#FFA500" }}>
                <span style={{ fontSize: "20px" }}>●</span> 조퇴&nbsp;
            </span>
            <span style={{ color: "#3B82F6" }}>
                <span style={{ fontSize: "20px" }}>●</span> 휴가&nbsp;
            </span>
            <span style={{ color: "#D32F2F" }}>
                <span style={{ fontSize: "20px" }}>●</span> 결근
            </span>
        </div>
    );
};

export default ColorLegend;