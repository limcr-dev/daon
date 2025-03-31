import { useNavigate } from 'react-router-dom';
import { Tree } from 'rsuite';

// 같은 링크가 있으면 오류남
const data = [
  {
    label: '공지사항',
    value: 'notice',
    children: [
      { label: '공지사항 목록', value: 'noticeList' },
      { label: '공지사항 작성', value: 'insertNotice' }
    ]
  },
  {
    label: '자료실',
    value: 'library',
    children: [
      { label: '자료실 목록', value: 'libraryList' },
      { label: '글 작성', value: 'libraryInsert' }
    ]
  }
];

const BoardMenu = () => {
  const navigate = useNavigate();

  const handleSelect = (selectedLabel) => {
    if (selectedLabel) {
      navigate(`/board/${selectedLabel.value}`);
    }
  };
  return (
    <div className="height_change">
      <Tree data={data} defaultExpandAll h-full onSelect={handleSelect} />
    </div>
  );
};
export default BoardMenu;
