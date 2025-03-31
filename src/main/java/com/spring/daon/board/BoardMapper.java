package com.spring.daon.board;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface BoardMapper {

	// 공지사항 목록
	public List<Notice> noticeList();
	
	// 공지사항 등록
	public int insertNotice(Notice notice);
	
	// 공지사항 상세 페이지
	public Notice noticeDetail(int notice_no);
	
	// 조회수 증가
	public void updateViews(int notice_no);
	
	// 공지사항 수정
	public int updateNotice(Notice notice);
	
	// 공지사항 삭제
	public int deleteNotice(int notice_no);
}
