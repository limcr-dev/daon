package com.spring.daon.messenger.favorite;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.daon.hrMgt.Employees;

@RestController
@RequestMapping("/messenger/favorite")
@CrossOrigin
public class FavoriteController {

	@Autowired
    private FavoriteServiceImpl fav;
	
	// 즐겨찾기 추가
	@PostMapping("/add")
	public ResponseEntity<String> addFavorite(@RequestBody FavoriteUser dto) {
	    boolean added = fav.addFavorite(dto.getUserId(), dto.getFavoriteId());
	    if (added) {
	        return ResponseEntity.ok("추가 성공");
	    } else {
	        return ResponseEntity.ok("이미 추가된 사용자");
	    }
	}

    // 즐겨찾기 삭제
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFavorite(@RequestParam int userId, @RequestParam int favoriteId) {
        fav.removeFavorite(userId, favoriteId);
        return ResponseEntity.ok("즐겨찾기 삭제 완료");
    }

    // 즐겨찾기 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<Employees>> getFavorites(@RequestParam int userId) {
        return ResponseEntity.ok(fav.getFavorites(userId));  
    }
    
    // 즐겨찾기 목록 검색 (실시간 필터용)
    @GetMapping("/search")
    public ResponseEntity<List<Employees>> searchFavorites(
            @RequestParam int userId,
            @RequestParam(required = false) String keyword) {
    	System.out.println("<<< searchFavorites >>> keyword : " + keyword);
        List<Employees> result;
        if (keyword == null || keyword.trim().isEmpty()) {
            result = fav.getFavorites(userId); // 전체 즐겨찾기 반환
        } else {
            result = fav.searchFavorites(userId, keyword); // 검색된 즐겨찾기만 반환
        }
        return ResponseEntity.ok(result);
    }
}
