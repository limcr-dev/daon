import { Tree } from 'rsuite';
import "../css/messengerTree.css";
import { useNavigate } from 'react-router-dom';

const data = [
  {
    label: '주소록',
    value: 'favorite',
    children: [
      { label: '주소록 검색', value: 'addressBook' },
      { label: '전체 목록', value: 'addressBookList' },
      // { label: '항목 3', value: 'item3' },
    ],
  },
];

const MessengerTree = () => {

  const navigate = useNavigate();

  const handleSelect = (label) => {
    if(label) {
      navigate(`/messenger/${label.value}`);
    }
  };

  return (
    <div className="height_change">
      <Tree data={data} defaultExpandAll className='h-full' onSelect={handleSelect} />
    </div>
  );
};
export default MessengerTree;
