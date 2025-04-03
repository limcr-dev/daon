// 직급 변환 함수
export const getPositionName = (id) => {
    const positions = {
        10: "사장",
        15: "부사장",
        20: "전무",
        25: "상무",
        30: "이사",
        35: "부장",
        40: "차장",
        45: "과장",
        50: "대리",
        55: "사원",
        60: "인턴",
    };
    return positions[id] || "직급 없음"; // 기본값 처리
};

// 직책 변환 함수
export const getRoleName = (id) => {
    const roles = {
        10: "임원",
        20: "부서장",
        30: "팀장",
        40: "부팀장",
        50: "팀원",
    };
    return roles[id] || "직책 없음";
};

// 재직 구분 변환 함수
export const getEmpStatus = (id) => {
    const statuses = {
        1: "재직",
        2: "휴직",
        3: "퇴직",
    };
    return statuses[id] || "상태 없음";
};

// 고용 형태 변환 함수
export const getEmpType = (id) => {
    const types = {
        1: "정직원",
        2: "계약직",
        3: "인턴",
        4: "프리랜서",
    };
    return types[id] || "고용 형태 없음";
};

// 관리자 유형 변환 함수
export const getAdminType = (id) => {
    const adminTypes = {
        1: "일반 사용자",
        2: "관리자",
        3: "인사 관리자",
    };
    return adminTypes[id] || "관리자 유형 없음";
};

// 부서 변환 함수
export const getDeptName = (id) => {
    const departments = {
        1: "다온",
        10: "경영부",
        101: "경영부(인사팀)",
        102: "경영부(총무팀)",
        103: "경영부(회계팀)",
        20: "개발부",
        201: "개발부(연구개발팀)",
        202: "개발부(생산관리팀)",
        203: "개발부(IT팀)",
        30: "영업부",
        301: "영업부(영업팀)",
        302: "영업부(마케팅팀)",
        303: "영업부(품질관리팀)",
    };
    return departments[id] || "부서 없음"; // 기본값 처리
};

export const getGender = (id) => {
    const gender = {
        M: "남자",
        F: "여자",
    };
    return gender[id] || "미등록";
};