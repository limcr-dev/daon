package com.spring.daon.messenger.chat;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.daon.hrMgt.Employees;
import com.spring.daon.hrMgt.HRMgtMapper;
import com.spring.daon.messenger.chat.dto.ChatGroup;
import com.spring.daon.messenger.chat.dto.ChatMessage;
import com.spring.daon.messenger.chat.dto.ChatRequest;
import com.spring.daon.messenger.chat.dto.ChatRoomList;
import com.spring.daon.messenger.chat.dto.ChatTyping;
import com.spring.daon.websocket.PresenceTracker;

@RestController
@RequestMapping("/messenger/chat")
@CrossOrigin
public class ChatController {
	
	private final SimpMessagingTemplate messagingTemplate;
    private final ChatServiceImpl chatServiceImpl;
    private final PresenceTracker presenceTracker;
    private final HRMgtMapper hrMgtMapper;

    @Autowired
    public ChatController(SimpMessagingTemplate messagingTemplate, ChatServiceImpl chatServiceImpl, PresenceTracker presenceTracker, HRMgtMapper hrMgtMapper) {
        this.messagingTemplate = messagingTemplate;
        this.chatServiceImpl = chatServiceImpl;
        this.presenceTracker = presenceTracker;
        this.hrMgtMapper = hrMgtMapper;
    }

    // 채팅 메시지 처리
    @MessageMapping("/chat.send")
//    @SendTo("/topic/room/{roomCode}")
    public void sendMessage(@Payload ChatMessage message) {
        System.out.println("<<< ChatController - send >>>");
        try {
        	ChatMessage savedMessage = chatServiceImpl.handleChatMessage(message); // receiverId도 여기서 처리

            // 구독 중인 클라이언트에게 메시지 전송
        	messagingTemplate.convertAndSend("/topic/room/" + savedMessage.getRoomCode(), savedMessage);
        } catch (Exception e) {
            System.err.println("채팅 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // 현재 유저가 참여 중인 채팅방 목록 조회
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomList>> getRooms(@RequestParam int userId) {
        System.out.println("<<< ChatController - getRooms >>>");
        List<ChatRoomList> list = chatServiceImpl.getChatRoomsByUser(userId);
        return ResponseEntity.ok(list);
    }
    
    // 채팅방 입장 (없으면 생성 + 상대방 정보 반환)
    @PostMapping("/enter")
    public ResponseEntity<Map<String, Object>> enterChatRoom(@RequestBody ChatRequest request) {
        System.out.println("<<< ChatController - enterChatRoom >>>");

        Map<String, Object> enterResult = chatServiceImpl.enterChatRoom(request.getUserId(), request.getTargetId());
//        Employees targetUser = chatServiceImpl.getTargetUserInfo(request.getTargetId());
        Employees targetUser = null;
        if (request.getTargetId() != null) {
            targetUser = chatServiceImpl.getTargetUserInfo(request.getTargetId());
        }

        Map<String, Object> result = new HashMap<>();
        result.putAll(enterResult); // roomCode + newRoom 둘 다 포함
        result.put("targetUser", targetUser);
        return ResponseEntity.ok(result);
    }
    
    // 정보불러오기
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getTargetUserInfo(
            @RequestParam String roomCode,
            @RequestParam int userId) {
        System.out.println("<<< ChatController - getTargetUserInfo >>>");

        // 1. roomCode에 참여 중인 두 명 중 userId를 제외한 상대방 ID 가져오기
        Integer targetId = chatServiceImpl.findTargetIdByRoom(roomCode, userId);

        if (targetId == null) {
            System.out.println(">>> 단체 채팅방: targetId 없음, null 반환");
            Map<String, Object> result = new HashMap<>();
            result.put("targetUser", null);
            return ResponseEntity.ok(result);
        }

        // 2. 상대방 정보 조회
        Employees targetUser = chatServiceImpl.getTargetUserInfo(targetId);

        return ResponseEntity.ok(Map.of("targetUser", targetUser));
    }
    
    // 보낸 사람 이름 불러오기
    @GetMapping("/userName")
    public ResponseEntity<Employees> getUserName(@RequestParam int userId) {
        Employees emp = hrMgtMapper.findByEmployee(userId);
        return ResponseEntity.ok(emp);
    }
    
    // 입력중
    @MessageMapping("/chat.typing")
    public void typing(@Payload ChatTyping typingInfo) {
        System.out.println(">>> 입력중 메시지 수신 on server: " + typingInfo);
    	messagingTemplate.convertAndSend("/topic/room/" + typingInfo.getRoomCode() + "/typing", typingInfo);
    }
    
    // 상태 표시
    @GetMapping("/status")
    public ResponseEntity<Boolean> getUserStatus(@RequestParam int targetId) {
        boolean isOnline = presenceTracker.isOnline(targetId);
        System.out.println(">>> " + targetId + " 온라인 여부: " + isOnline);
        return ResponseEntity.ok(isOnline);
    }
    
    // 이전 대화 불러오기
    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@RequestParam String roomCode) {
        List<ChatMessage> messages = chatServiceImpl.getMessagesByRoomCode(roomCode);
        return ResponseEntity.ok(messages);
    }
    
    // 단체채팅 생성 및 참가자등록
    @PostMapping("/createGroup")
    public ResponseEntity<Map<String, String>> createGroupChat(@RequestBody ChatGroup request) {
    	String roomCode = chatServiceImpl.createGroupChat(request);
        return ResponseEntity.ok(Map.of("roomCode", roomCode));
    }
    
    // 단체 채팅방 목록 조회
    @GetMapping("/groupList")
    public List<ChatRoomList> getGroupChatRooms(@RequestParam int userId) {
        return chatServiceImpl.getGroupChatRooms(userId);
    }
    
    // 단체 채팅방 메시지 리스트 가져오기
    @GetMapping("/messages")
    public List<ChatMessage> getMessages(@RequestParam String roomCode) {
        return chatServiceImpl.getMessagesByRoomCode(roomCode);
    }
    
    // 단체채팅(사용자 전체 목록 (본인제외))
    @GetMapping("/users")
    public ResponseEntity<List<Employees>> getAllUsersExceptMe(@RequestParam int myId) {
        List<Employees> users = hrMgtMapper.findAllExceptMe(myId);
        return ResponseEntity.ok(users);
    }
    
    // 단체채팅 사용자 목록
    @GetMapping("/participants")
    public ResponseEntity<List<Employees>> getParticipants(@RequestParam String roomCode) {
        List<Employees> participants = chatServiceImpl.getParticipants(roomCode);
        return ResponseEntity.ok(participants);
    }
}
