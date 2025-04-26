package com.spring.daon.messenger.chat;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.spring.daon.hrMgt.Employees;
import com.spring.daon.messenger.chat.dto.ChatMessage;
import com.spring.daon.messenger.chat.dto.ChatRoomList;

@Mapper
@Repository
public interface ChatMapper {
	// 방 존재 여부 확인
	boolean isRoomExists(String roomCode);
	
    String findRoomCodeByUsers(@Param("user1") int user1, @Param("user2") int user2);
    
    // 방 생성
    void createRoom(String roomCode);
    
	// 참여자 등록
    void insertRoomUser(@Param("roomCode") String roomCode, @Param("userId") int userId);
    
    // 메시지 저장
    void saveMessage(ChatMessage message);
    
	// 참여 중인 채팅방 목록
    List<ChatRoomList> getChatRoomsByUser(int userId);
    
    List<ChatMessage> selectRecentMessages(String roomCode);
    
    // 상대방 정보 조회
    Employees selectTargetUser(int targetId);
    
    // 채팅방 참여자 중 상대방 ID 찾기
    List<Integer> findOtherUserIdInRoom(@Param("roomCode") String roomCode, @Param("myId") int myId);
    
    void markAsRead(String roomCode, int userId);
    
    // 채팅방에서 sender 제외한 receiverId 조회
    int getReceiverId(@Param("roomCode") String roomCode, @Param("senderId") int senderId);
    
    // 채팅방 이전 메시지 불러오기
    List<ChatMessage> getMessagesByRoomCode(String roomCode);
}
