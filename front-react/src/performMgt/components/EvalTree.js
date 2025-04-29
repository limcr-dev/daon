import { Tree } from 'rsuite';
import "../../performMgt/css/evalTree.css";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../common/contexts/UserContext";

const EvalTree = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // 현재 로그인 사용자

  const noLook1 = user?.admin_type === 2; //관리자
  const noLook2 = user?.admin_type === 3; // 인사관리자
  const noLook4 = user?.admin_type === 1; // 사용자

  const data = [
    {    
      label: '평가 현황',
      value: 'evaluation1',
      children: [
        { label: '평가 조회', value: 'evalSelect' },  // 전체다봐
        !noLook1 &&{ label: '나의 현황', value: 'perEvalStatus'}, // 관리자 빼고
      ].filter(Boolean),
    },
    !noLook1 &&{  // 관리자 빼고 모두 볼수 있다
      label: '인사 평가',
      value: 'evaluation2',
      children: [
        { label: '자기 평가', value: 'selfQues'},
        { label: '동료 평가', value: 'peerQues'},
        { label: '달성 평가', value: 'goalForm' }, 
      ].filter(Boolean),
    },
    {
      label: '평가 관리',
      value: 'evaluation3',
      children: [
        !noLook4 && { label: '평가 리스트', value: 'evalList' }, //사용자는 못봐 관리자만 봐
        noLook2 && { label: '평가 관리', value: 'checkComp' }, // 인사관리자만
      ].filter(Boolean),
    },
  ].filter(Boolean) // null 제거;

  const handleSelect = (label) => {
    if (!label.value.includes('evaluation')) {
      navigate(`/performMgt/${label.value}`);
    }
  };
  return (
    <div className="height_change">
      <Tree data={data} defaultExpandAll className="h-full" onSelect={handleSelect} />
    </div>
  );
};
export default EvalTree;