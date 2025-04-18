import { useState } from 'react';
import {
  Container,
  Content,
} from 'rsuite';
import {
  FiSearch,
  FiMessageSquare,
  FiUsers,
  FiSettings
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';



const MessengerRun = () => {

  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  
    const goHome = () => {
      navigate('/messenger/messengerRun');
    }
  
    const goChattingList = () => {
      navigate('/messenger/messengerChatList');
    }
  
    const goSetting = () => {
      navigate('/messenger/messengerSetting');
    }


  return (
    <div className="flex flex-col h-screen w-[350px] bg-white shadow-md">
      {/* Search */}
      <div className="p-4 bg-purple-200 rounded-b-3xl">
        <div className="flex items-center bg-white px-3 py-2 rounded-full">
          <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mr-2">D</div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm"
            placeholder="Search by name, number..."
          />
          <FiSearch className="text-gray-500" />
        </div>
      </div>

      {/* Chats */}
      <div className="p-4 text-sm font-semibold text-gray-500">즐겨찾기 목록</div>
      
      <div className="flex-1 overflow-auto px-4">

      </div>



      {/* Bottom Navigation */}
			<div className="flex justify-around items-center py-3 border-t bg-white" style={{ display: 'flex' }}>
				<div className="flex flex-col items-center text-gray-400">
					<button className="text-xs mt-1" onClick={goHome}><FiUsers size={20} />Contacts</button>
				</div>

				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

				<div className="flex flex-col items-center text-purple-400">
					<button className="text-xs mt-1" onClick={goChattingList}><FiMessageSquare size={20} />Chats</button>
				</div>

				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

				<div className="flex flex-col items-center text-gray-400">
					<button className="text-xs mt-1" onClick={goSetting}><FiSettings size={20} />Settings</button>
				</div>
			</div>
    </div>
  );
};
export default MessengerRun;