package com.spring.daon.websocket;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class PresenceTracker {
	private final Map<Integer, Boolean> onlineUsers = new ConcurrentHashMap<>();

    public void setOnline(int userId) {
        onlineUsers.put(userId, true);
    }

    public void setOffline(int userId) {
        onlineUsers.remove(userId);
    }

    public boolean isOnline(int userId) {
        return onlineUsers.containsKey(userId);
    }

    public Set<Integer> getAllOnlineUsers() {
        return onlineUsers.keySet();
    }
}
