package com.spring.daon.messenger.favorite;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.daon.hrMgt.Employees;

@Mapper
@Repository
public interface FavoriteMapper {
	boolean existsFavorite(int userId, int targetId);

    void insertFavorite(int userId, int targetId);

    void deleteFavorite(int userId, int targetId);

    List<Employees> selectFavoritesByUser(int userId);
    
    List<Employees> searchFavoritesByKeyword(int userId, String keyword);
}
