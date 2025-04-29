package com.spring.daon.websocket;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {
	private final PresenceTracker presenceTracker;

    public WebSocketEventListener(PresenceTracker presenceTracker) {
        this.presenceTracker = presenceTracker;
    }

    @EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        // JWT에서 사용자 정보 추출
    	StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String empNo = headerAccessor.getFirstNativeHeader("emp_no");
        if (empNo != null) {
            int userId = Integer.parseInt(empNo);
            System.out.println("🔗 WebSocket 연결됨, emp_no: " + userId);
            presenceTracker.setOnline(userId);

            // 여기 추가!
            if (empNo != null) {
                presenceTracker.setOnline(Integer.parseInt(empNo));
                System.out.println("✅ PresenceTracker 등록 성공: " + empNo);
            } else {
                System.out.println("⚠️ PresenceTracker 등록 실패: emp_no 없음");
            }
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
    	StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        if (headerAccessor.getSessionAttributes() != null) {
            Object empNoObj = headerAccessor.getSessionAttributes().get("emp_no");
            if (empNoObj != null) {
                int empNo = Integer.parseInt(empNoObj.toString());
                System.out.println("❌ WebSocket 연결 끊김, emp_no: " + empNo);
                presenceTracker.setOffline(empNo);
            }
        }
    }
}
