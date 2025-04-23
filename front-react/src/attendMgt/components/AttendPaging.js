import React, { useEffect, useState } from 'react';
import Paging from '../../common/components/paging';

const AttendPaging = (props) => {

    const { deptStatusList, onPageChange } = props;

     // 리스트의 전체 길이를 count
    const count = deptStatusList.length;

    // paging 컴포넌트에 넘길 값
    const [paging, setPaging] = useState({
        page: 1,
        size: 10,
        totalCount: count,
    });

    const fetchData = (page) => {
        setPaging((prev) => ({
            ...prev,
            page: page,
        }));
        onPageChange(page);
    };
    useEffect(() => {
        fetchData(1);
        setPaging((prev) => ({
            ...prev,
            totalCount: count,
        }));
    }, [count]);
    
    return (
        <div>
            <Paging paging={paging} onPageChange={fetchData} />
        </div>
    );
};

export default AttendPaging;