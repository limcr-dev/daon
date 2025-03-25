import { Tree } from 'rsuite';
import "../../css/mailTree.css";

const data = [
  {
    label: '즐겨찾기',
    value: 'favorite',
    children: [
      { label: '항목 1', value: 'item1' },
      { label: '항목 2', value: 'item2' },
      { label: '항목 3', value: 'item3' },
    ],
  },
  {
    label: '태그',
    value: 'tag',
    children: [
      { label: '개발', value: 'development' },
      { label: '디자인', value: 'design' },
      { label: '기획', value: 'planning' },
    ],
  },
  {
    label: '메일함',
    value: 'mailbox',
    children: [
      { label: '받은 편지함', value: 'inbox' },
      { label: '보낸 편지함', value: 'sent' },
      { label: '스팸', value: 'spam' },
    ],
  },
];

const MailTree = () => {
    return(
      <div className="height_change">
        <Tree data={data} defaultExpandAll h-full/>
      </div>
);
};
export default MailTree;
