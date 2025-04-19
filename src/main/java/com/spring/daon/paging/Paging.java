package com.spring.daon.paging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paging {
	private int page;          // 현재 페이지 (1부터 시작)
    private int size;          // 페이지당 게시글 수
    private int totalCount;    // 전체 게시글 수

    private int startRow;      // DB 조회용 offset
    private int endRow;        // DB 조회용 limit
    private int totalPages;    // 전체 페이지 수

    private int startPage;     // 화면에 보여줄 시작 페이지
    private int endPage;       // 화면에 보여줄 끝 페이지

    private int pageBlock = 10; // 한 화면에 보여줄 페이지 수 (1~10, 11~20...)
	
	public Paging(int page, int size, int totalCount) {
        this.page = page <= 0 ? 1 : page;
        this.size = size <= 0 ? 10 : size;
        this.totalCount = totalCount;

        this.totalPages = (int) Math.ceil((double) totalCount / this.size);

        this.startRow = (this.page - 1) * this.size;
        this.endRow = this.page * this.size;

        this.startPage = ((this.page - 1) / pageBlock) * pageBlock + 1;
        this.endPage = Math.min(this.startPage + pageBlock - 1, totalPages);
    }
}
