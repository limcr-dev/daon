package com.spring.daon.messenger.favorite;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteUser {
	private int userId;
    private int favoriteId;
}
