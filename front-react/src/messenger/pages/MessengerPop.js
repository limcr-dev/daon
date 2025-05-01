import React, { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useUser } from '../../common/contexts/UserContext';
import { API_URL } from '../../common/components/helpers/axios_helper';

const MessengerPop = () => {
   const { user } = useUser();
   const clientRef = useRef(null);

   useEffect(() => {
      if (!user?.emp_no) return;

      const socket = new SockJS(`${API_URL}/ws-chat`);
      const client = new Client({
         webSocketFactory: () => socket,
         reconnectDelay: 5000,
         connectHeaders: {
            emp_no: String(user.emp_no),
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` // JWT 토큰 추가
         },
         onConnect: () => {
            console.log("🔔 알림 WebSocket 연결 완료");

            client.subscribe(`/topic/alert/${user.emp_no}`, (message) => {
               const msg = JSON.parse(message.body);

               // 이미 채팅창 열려 있으면 알림 안띄움
               const isOpen = localStorage.getItem(`chat-open-${msg.roomCode}`) === 'true';
               if (isOpen) return;

               console.log("🔔 수신된 알림 메시지:", msg);

               const preview = msg.type === 'TEXT' ? (msg.content.length > 20 ? msg.content.slice(0, 20) + "..." : msg.content)
                  : (msg.type === 'FILE' ? '[파일]' : '[이미지]');

               toast.info(`${msg.senderName || '새 메시지'} 님: ${preview}`, {
                  position: "bottom-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  onClick: () => {
                     const windowName = `chat-${msg.roomCode}`;
                     const newWindow = window.open(`/messengerMgt/chat/${msg.roomCode}`, windowName, 'width=500,height=600');
                     if (newWindow) {
                        newWindow.focus();
                     }
                  }
               });
            });
         }
      });

      client.activate();
      clientRef.current = client;

      return () => {
         if (clientRef.current) {
            clientRef.current.deactivate();
         }
      };
   }, [user?.emp_no]);

   return (
      <>
         <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      </>
   );
};

export default MessengerPop;
