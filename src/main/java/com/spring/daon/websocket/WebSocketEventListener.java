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
            presenceTracker.setOnline(Integer.parseInt(empNo));
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String empNo = headerAccessor.getFirstNativeHeader("emp_no");
        if (empNo != null) {
            presenceTracker.setOffline(Integer.parseInt(empNo));
        }
    }
}
