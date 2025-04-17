import React from 'react';

const ColorLegned = () => {
    return (
        <div style={{ display: "flex" }}>
            <span style={{ color: "#81d742" }}>
                <span style={{ fontSize: "20px" }}>●</span> 정상&nbsp;
            </span>
            <span style={{ color: "red" }}>
                <span style={{ fontSize: "20px" }}>●</span> 지각&nbsp;
            </span>
            <span style={{ color: "#56adf9" }}>
                <span style={{ fontSize: "20px" }}>●</span> 수정&nbsp;
            </span>
            <span style={{ color: "orange" }}>
                <span style={{ fontSize: "20px" }}>●</span> 조퇴
            </span>
        </div>
    );
};

export default ColorLegned;