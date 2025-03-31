package com.spring.daon.board;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.daon.board.BoardMapper;
import com.spring.daon.board.Notice;

@Service
public class BoardServiceImpl{

	@Autowired
	private BoardMapper boardMapper;
	
	@Transactional(readOnly=true)
	public List<Notice> noticeList() {
		System.out.println("<<< BoardServiceImpl - noticeList >>>");
		return boardMapper.noticeList();
	}
	
	// 공지사항 등록
	@Transactional
	public int insertNotice(Notice notice) {
		System.out.println("<<< BoardServiceImpl - insertNotice >>>");
		return boardMapper.insertNotice(notice);
	}

	// 공지사항 상세 페이지
	@Transactional(readOnly=true)
	public Notice noticeDetail(int notice_no) {
		System.out.println("<<< BoardServiceImpl - noticeDetail >>>");
		return boardMapper.noticeDetail(notice_no);
	}
	
	// 조회수 증가
	@Transactional
	public void updateViews(int notice_no) {
		System.out.println("<<< BoardServiceImpl - updateViews >>>");
		boardMapper.updateViews(notice_no);
	}

	// 공지사항 수정
	@Transactional
	public int updateNotice(Notice notice) {
		System.out.println("<<< BoardServiceImpl - updateNotice >>>");
		return boardMapper.updateNotice(notice);
	}

	// 공지사항 삭제
	@Transactional
	public String deleteNotice(int notice_no) {
		System.out.println("<<< BoardServiceImpl - deleteNotice >>>");
		boardMapper.deleteNotice(notice_no);
		return "ok";
	}

}
