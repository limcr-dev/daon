package com.spring.daon.messenger.chat;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.daon.hrMgt.Employees;
import com.spring.daon.hrMgt.HRMgtMapper;
import com.spring.daon.messenger.chat.dto.ChatMessage;
import com.spring.daon.messenger.chat.dto.ChatRoomList;

@Service
public class ChatServiceImpl {
	
	@Autowired
	private ChatMapper chatMapper;
	
	@Autowired
    private HRMgtMapper hrMgtMapper;
	
	@Autowired
    private SimpMessagingTemplate messagingTemplate;
	
	@Transactional
    public void handleChatMessage(ChatMessage message) {
        System.out.println("<<< ChatServiceImpl - handleChatMessage >>>");

//        String roomCode = message.getRoomCode();
//        
//        Employees sender = hrMgtMapper.findByEmployee(message.getSenderId());
//        if (sender != null) {
//            message.setSenderName(sender.getEmp_name());  // 이름 세팅
//        }
//
//        // 방이 없다면 생성
//        if (!chatMapper.isRoomExists(roomCode)) {
//            chatMapper.createRoom(roomCode); // 방 생성
//            chatMapper.insertRoomUser(roomCode, message.getSenderId());
//            chatMapper.insertRoomUser(roomCode, receiverId);
//        }
//
//        // 메시지 저장
//        chatMapper.saveMessage(message);
//        
//        messagingTemplate.convertAndSend("/topic/alert/" + receiverId, message);
        
        String roomCode = message.getRoomCode();
        Employees sender = hrMgtMapper.findByEmployee(message.getSenderId());
        if (sender != null) {
            message.setSenderName(sender.getEmp_name());
        }

        // 방 없으면 생성
        if (!chatMapper.isRoomExists(roomCode)) {
            chatMapper.createRoom(roomCode);
            chatMapper.insertRoomUser(roomCode, message.getSenderId());
            // 단체방이면 여기서 receiver를 굳이 추가할 필요 없음
        }

        // 메시지 저장
        chatMapper.saveMessage(message);

        // 실시간 알림 전송
        List<Integer> userIds = chatMapper.getUserIdsByRoomCode(roomCode);
        for (Integer userId : userIds) {
            if (!userId.equals(message.getSenderId())) { // 자기 자신 제외
                messagingTemplate.convertAndSend("/topic/alert/" + userId, message);
            }
        }
    }
	
	// 참여 중인 채팅방 목록 조회
	public List<ChatRoomList> getChatRoomsByUser(int userId) {
        System.out.println("<<< ChatServiceImpl - getChatRoomsByUser >>>");
        return chatMapper.getChatRoomsByUser(userId);
    }
	
	@Transactional
    public String enterChatRoom(int userId, int targetId) {
        System.out.println("<<< ChatServiceImpl - enterChatRoom >>>");
        // 1. 기존 방 조회
        String existingRoomCode = chatMapper.findRoomCodeByUsers(userId, targetId);
        if (existingRoomCode != null) {
            return existingRoomCode;
        }

        // 2. 새 방 생성
        String newRoomCode = UUID.randomUUID().toString();
        chatMapper.createRoom(newRoomCode);

        // 3. 두 유저 모두 참여 등록
        chatMapper.insertRoomUser(newRoomCode, userId);
        chatMapper.insertRoomUser(newRoomCode, targetId);

        return newRoomCode;
    }
	
	// 유저정보 가져오기
	public Employees getTargetUserInfo(int targetId) {
        System.out.println("<<< ChatServiceImpl - getTargetUserInfo >>>");
        return chatMapper.selectTargetUser(targetId);
    }
	
	public Integer findTargetIdByRoom(String roomCode, int userId) {
	    List<Integer> ids = chatMapper.findOtherUserIdInRoom(roomCode, userId);
	    return ids.isEmpty() ? null : ids.get(0);
	}
	
	// 실시간 알림
	public int getReceiverId(String roomCode, int senderId) {
	    // DB에서 해당 roomCode에 참여 중인 2명의 ID를 가져오고 senderId를 제외한 ID 반환
	    return chatMapper.getReceiverId(roomCode, senderId);
	}
	
	// 대화 내용 불러오기
	public List<ChatMessage> getMessagesByRoomCode(String roomCode) {
	    return chatMapper.getMessagesByRoomCode(roomCode);
	}
}
