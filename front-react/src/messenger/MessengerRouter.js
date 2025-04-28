import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Messenger from './pages/Messenger';
import AddressBook from './pages/AddressBook';
import MessengerRun from './pages/MessengerRun';
import MessengerChatList from './pages/MessengerChatList';
import MessengerSetting from './pages/MessengerSetting';
import MessengerChat from './pages/MessengerChat';
import MessengerNewChat from './pages/MessengerNewChat';
import MessengerNewGroup from './pages/MessengerNewGroup';
import MessengerNewSingle from './pages/MessengerNewSingle';
import News_more from '../crawl/news_more';

const MessengerRouter = () => {
	return (
		<Routes>
			{/* <Route path="/" exact={true} element={<Messenger />} />                              메신저 */}
			<Route path="/addressBook" exact={true} element={<AddressBook />} />                {/* 주소록검색 */}
			<Route path="/messengerRun" exact={true} element={<MessengerRun />} />
			<Route path="/messengerChatList" exact={true} element={<MessengerChatList />} />
			<Route path="/messengerSetting" exact={true} element={<MessengerSetting />} />
			<Route path="/chat/:roomId" element={<MessengerChat />} />
			<Route path="/messengerNewChat" element={<MessengerNewChat />} />
			<Route path="/messengerNewSingle" element={<MessengerNewSingle />} />	{/*1:1 대화*/}
			<Route path="/messengerNewGroup" element={<MessengerNewGroup />} />		{/*단체 대화*/}
			<Route path="/crwal/news_more" element={<News_more />} />
		</Routes>
	);
};

export default MessengerRouter;