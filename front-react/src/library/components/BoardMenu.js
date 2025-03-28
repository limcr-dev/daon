import { useNavigate } from 'react-router-dom';
import { Tree } from 'rsuite';

const data = [
  {
    label: '공지사항',
    value: 'noticeList',
    children: [
      { label: '공지사항 목록', value: 'noticeList' },
      { label: '공지사항 작성', value: 'noticeInsert' }
    ]
  },
  {
    label: '자료실',
    value: 'libraryList',
    children: [
      { label: '자료실 목록', value: 'libraryList' },
      { label: '글 작성', value: 'libraryInsert' }
    ]
  }
];

const BoardMenu = () => {
  const navigate = useNavigate();

  const handleSelect = (selectedLabel) => {
    if(selectedLabel) {
      navigate(`/${selectedLabel.value}`);
    }
  };
  return (
    <div className="height_change">
      <Tree data={data} defaultExpandAll onSelect={handleSelect}/>
    </div>
  );
};
export default BoardMenu;
