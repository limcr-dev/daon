package com.spring.daon.board;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BoardServiceImpl{

	@Autowired
	private BoardMapper boardMapper;
	
	// 공지사항 가져오기
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
	@Transactional
	public Notice noticeDetail(int notice_no) {
		System.out.println("<<< BoardServiceImpl - noticeDetail >>>");
		boardMapper.updateViews(notice_no);
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
	
	// 자료 목록 가져오기
	@Transactional(readOnly=true)
	public List<Library> libraryList() {
		System.out.println("<<< BoardServiceImpl - libraryList >>>");
		return boardMapper.libraryList();
	}
	
	// 자료 등록
	@Transactional
	public int insertLibrary(Library library) {
		System.out.println("<<< BoardServiceImpl - insertLibrary >>>");
		return boardMapper.insertLibrary(library);
	}

	// 자료 상세 페이지
	@Transactional(readOnly=true)
	public Library libraryDetail(int library_no) {
		System.out.println("<<< BoardServiceImpl - libraryDetail >>>");
		boardMapper.libraryViews(library_no);
		return boardMapper.libraryDetail(library_no);
	}
	
	// 자료 조회수 증가
	@Transactional
	public void libraryViews(int library_no) {
		System.out.println("<<< BoardServiceImpl - libraryViews >>>");
		boardMapper.libraryViews(library_no);
	}

	// 자료 수정
	@Transactional
	public int updateLibrary(Library library) {
		System.out.println("<<< BoardServiceImpl - updateLibrary >>>");
		return boardMapper.updateLibrary(library);
	}

	// 자료 삭제
	@Transactional
	public String deleteLibrary(int library_no) {
		System.out.println("<<< BoardServiceImpl - deleteLibrary >>>");
		boardMapper.deleteLibrary(library_no);
		return "ok";
	}

}
