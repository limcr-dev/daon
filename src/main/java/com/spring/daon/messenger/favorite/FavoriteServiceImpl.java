package com.spring.daon.messenger.favorite;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.daon.hrMgt.Employees;

@Service
public class FavoriteServiceImpl {

	@Autowired
    private FavoriteMapper favoriteMapper;
	
	public boolean addFavorite(int userId, int targetId) {
		if (!favoriteMapper.existsFavorite(userId, targetId)) {
	        favoriteMapper.insertFavorite(userId, targetId);
	        return true;
	    }
	    return false;
    }

    public void removeFavorite(int userId, int targetId) {
        favoriteMapper.deleteFavorite(userId, targetId);
    }

    public List<Employees> getFavorites(int userId) {
        return favoriteMapper.selectFavoritesByUser(userId);
    }
    
    public List<Employees> searchFavorites(int userId, String keyword) {
        return favoriteMapper.searchFavoritesByKeyword(userId, "%" + keyword + "%");
    }
}
