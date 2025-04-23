import { Popover } from "rsuite";


// 발생 연차 설명
export const vacationInfo = (
    <Popover style={{ whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
        <div>
            <b>1년 미만 근속자</b><br />
            - 입사 후 1개월 근무할 때마다 1일씩 지급<br />
            - 최대 1년간 11일 발생<br />
            - 단, 1년 이상 근속 시 기존 지급분(최대 11일)은 차감됨<br /><br />

            <b>1년 이상 근속자</b><br />
            - 1년 근속 시 15일 지급<br />
            - 이후 2년마다 1일 추가 지급, 최대 25일까지 가능<br />
            - 예: 3년차 16일, 5년차 17일, … 21년차 25일<br />
            - 1년간 소정 근로일의 80% 이상 출근해야 발생
        </div>
    </Popover>
)
// 회차 단위 연차 이력 관리
export const vacationInfo2 = (
    <Popover style={{ whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
        <div>
            <b>회차 단위 연차 이력 관리</b><br />
            - 연차는 '연도 기준'이 아닌 '입사일 기준 1년 단위'로 관리됩니다.<br />
            - 입사일을 기준으로 1년마다 새로운 회차가 시작됩니다.<br /><br />
            - 예: 입사일이 2023.12.20인 경우 → 1회차: 2023.12.20 ~ 2024.12.19<br />
            - 회차별로 연차 발생·사용·잔여·만료 이력을 구분해 확인할 수 있습니다.
        </div>
    </Popover>
)
// 연차 만료일 설명
export const vacationInfo3 = (
    <Popover style={{ minWidth: "250px", whiteSpace: "pre-line", padding: "10px" }} arrow={false} >
        <div>가장 빠르게 만료되는 연차의 만료일입니다.</div>
    </Popover>
)

// 연차 날짜 검색 설명
export const vacationInfo4 = (
    <Popover style={{ whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
        <div>사용,생성 날짜기준으로 검색 됩니다.</div>
    </Popover>
)

// 부서,팀 근태현황
export const deptStatusInfo = (
    <Popover style={{ whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
        <div>
            <b>리스트 정렬 방식</b><br />
            - 직급이 높은 순으로 정렬됩니다<br />
            - 동일 직급일 경우, 날짜가 최근인 순으로 정렬됩니다<br />
            - 날짜가 같을 경우, 이름 기준 오름차순으로 정렬됩니다<br />
        </div>
    </Popover>
)

// 전사 연차 생성내역
export const AllVacationCreateInfo = (
    <Popover style={{ whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
        <div>
            <b>리스트 정렬 방식</b><br />
            - 직급이 높은 순으로 정렬됩니다<br />
            - 동일 직급일 경우, 생성일이 최근인 순으로 정렬됩니다<br />
            - 생성일이 같을 경우, 이름 기준 오름차순으로 정렬됩니다<br />
        </div>
    </Popover>
)

// 전사 연차 사용내역
export const AllVacationUseInfo = (
    <Popover style={{ whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
        <div>
            <b>리스트 정렬 방식</b><br />
            - 직급이 높은 순으로 정렬됩니다<br />
            - 동일 직급일 경우, 가장 최근 사용 시작일 순으로 정렬됩니다<br />
            - 사용 시작일이 같을 경우, 이름 기준 오름차순으로 정렬됩니다<br />
        </div>
    </Popover>
)

// 수정 정보
export const EditInfo = (
    <Popover style={{ whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
        <div>
            <b>결근 및 휴가 선택 시 처리 방식</b><br />
            - <b>결근</b>을 선택하면 지각/조퇴 및 출퇴근 시간 설정이 모두 비활성화됩니다.<br />
            - <b>휴가</b>를 선택하면 결근 여부 포함, 모든 출퇴근 관련 항목이 비활성화됩니다.<br /><br />
            - 즉, 결근 또는 휴가일 경우에는 별도의 출퇴근 정보 입력 없이 정상 처리됩니다.
        </div>
    </Popover>
)
// 수정 정보2
export const EditInfo2 = (
    <Popover style={{ whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
        <div>
            <b>근태 기록 수정 안내</b><br />
            - 해당 메뉴는 <b>휴가 신청이 아닌 일반 근태 정보 수정</b>을 위한 기능입니다.<br />
            - 근태 정보를 수정해도 <b>사원의 보유 연차 및 잔여 연차에는 영향을 주지 않으며</b>, <b>사용 횟수에는 반영됩니다.</b><br /><br />
            - 연차 반영이 필요한 경우에는 <b>휴가 신청 메뉴</b>를 이용해 주세요.
        </div>
    </Popover>
)
