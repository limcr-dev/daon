import React from 'react';

// css
import "../css/AttendCommon.css"
// icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const MoveDateHeader = ({ currentDate, setCurrentDate, setMoveDate }) => {
    // 버튼 클릭 시
    const changeDate = (plusminus) => {

        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + plusminus
        );
        setMoveDate({ year: newDate.getFullYear(), month: newDate.getMonth() + 1 })
        setCurrentDate(newDate);
    };

    // 상단 날짜 표기방식
    const monthDisplay = currentDate.toLocaleString('default', {
        year: 'numeric',
        month: 'long'
    });

    return (
        <div>
            <div style={{ display: "flex" }}>
                <b style={{ fontSize: "20px" }}>내 근태 현황</b>

                <div className="headCenter">

                    <button onClick={() => changeDate(-1)}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <h5>{monthDisplay}</h5>
                    <button onClick={() => changeDate(1)}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                <br/><br/>
            </div>
        </div>

    );
};

export default MoveDateHeader;