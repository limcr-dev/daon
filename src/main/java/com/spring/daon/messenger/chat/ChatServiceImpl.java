package com.spring.daon.messenger.chat;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.daon.hrMgt.Employees;
import com.spring.daon.hrMgt.HRMgtMapper;
import com.spring.daon.messenger.chat.dto.ChatGroup;
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
	
	// 채팅 메시지 처리 (1대1 / 단체 분기 처리)
	@Transactional
	public ChatMessage handleChatMessage(ChatMessage message) {
	    System.out.println("<<< ChatServiceImpl - handleChatMessage >>>");

	    String roomCode = message.getRoomCode();
	    
	    // 보낸 사람 이름 세팅
        Employees sender = hrMgtMapper.findByEmployee(message.getSenderId());
        if (sender != null && (message.getSenderName() == null || message.getSenderName().isEmpty())) {
            message.setSenderName(sender.getEmp_name());
        }
        System.out.println("senderName == >" + message.getSenderName());

        // 방이 존재하지 않으면 생성
        if (chatMapper.isRoomExists(roomCode) == 0) {
            chatMapper.createRoom(roomCode);
            chatMapper.insertRoomUser(roomCode, message.getSenderId());
        }

        // 메시지 저장
        message.setTimestamp(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
        chatMapper.saveMessage(message);

        // 방 타입(1대1 / 단체) 구분
        boolean isGroup = chatMapper.getRoomGroupByRoomCode(roomCode);

        if (isGroup) {
            // 단체 채팅방일 경우
            List<Integer> userIds = chatMapper.getParticipantIdsByRoomCode(roomCode);
            for (Integer userId : userIds) {
                if (!userId.equals(message.getSenderId())) {
                    System.out.println("단체 채팅 알림 → " + userId);
                    messagingTemplate.convertAndSend("/topic/alert/" + userId, message);
                }
            }
        } else {
            // 1대1 채팅방일 경우
        	Integer receiverId = chatMapper.getReceiverId(roomCode, message.getSenderId());
        	if (receiverId != null) {
        	    messagingTemplate.convertAndSend("/topic/alert/" + receiverId, message);
        	} else {
        	    System.out.println("receiverId를 찾을 수 없습니다 (1:1 채팅방에서 상대방 없음)");
        	}
        }
        return message;
    }
	
	// 참여 중인 채팅방 목록 조회
	public List<ChatRoomList> getChatRoomsByUser(int userId) {
        System.out.println("<<< ChatServiceImpl - getChatRoomsByUser >>>");
        return chatMapper.getChatRoomsByUser(userId);
    }
	
	// 1대1 채팅방 입장
	@Transactional
    public String enterChatRoom(int userId, int targetId) {
        System.out.println("<<< ChatServiceImpl - enterChatRoom >>>");
        // 기존 방 조회
        String existingRoomCode = chatMapper.findRoomCodeByUsers(userId, targetId);
        if (existingRoomCode != null) {
            return existingRoomCode;
        }

        // 새 방 생성
        String newRoomCode = UUID.randomUUID().toString();
        chatMapper.createRoom(newRoomCode);

        // 두 유저 모두 참여 등록
        chatMapper.insertRoomUser(newRoomCode, userId);
        chatMapper.insertRoomUser(newRoomCode, targetId);

        return newRoomCode;
    }
	
	// 유저정보 가져오기
	public Employees getTargetUserInfo(int targetId) {
        System.out.println("<<< ChatServiceImpl - getTargetUserInfo >>>");
        return chatMapper.selectTargetUser(targetId);
    }
	
	// 1대1 채팅방에서 상대방 ID 찾기
	public Integer findTargetIdByRoom(String roomCode, int userId) {
	    List<Integer> ids = chatMapper.findOtherUserIdInRoom(roomCode, userId);
	    return ids.isEmpty() ? null : ids.get(0);
	}
	
	// 실시간 알림
	public int getReceiverId(String roomCode, int senderId) {
	    // DB에서 해당 roomCode에 참여 중인 2명의 ID를 가져오고 senderId를 제외한 ID 반환
	    return chatMapper.getReceiverId(roomCode, senderId);
	}
	
	// (공통)대화 내용 불러오기
	public List<ChatMessage> getMessagesByRoomCode(String roomCode) {
        return chatMapper.findMessagesByRoomCode(roomCode);
    }
	
	// 단체채팅 방 생성 및 참가자 등록
	@Transactional
	public String createGroupChat(ChatGroup request) {
	    String roomCode = UUID.randomUUID().toString();
	    chatMapper.insertChatRoom(roomCode);

	    // 나 자신도 참가자 등록 해야됨
	    List<Integer> allParticipants = new ArrayList<>(request.getUserIds());
	    if (!allParticipants.contains(request.getCreatorId())) { // 본인 중복 방지
	        allParticipants.add(request.getCreatorId());
	    }

	    for (Integer userId : allParticipants) {
	        chatMapper.insertChatParticipant(roomCode, userId);
	    }
	    return roomCode;
	}
	
	// 단체 채팅방 목록 조회
    public List<ChatRoomList> getGroupChatRooms(int userId) {
        return chatMapper.findGroupChatRooms(userId);
    }
    
    // 단체 채팅 사용자 목록
    public List<Employees> getParticipants(String roomCode) {
        List<Integer> userIds = chatMapper.getParticipantIdsByRoomCode(roomCode);
        List<Employees> users = new ArrayList<>();
        for (Integer id : userIds) {
            Employees e = hrMgtMapper.findByEmployee(id);
            if (e != null) {
                users.add(e);
            }
        }
        return users;
    }
}
