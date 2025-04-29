package com.spring.daon.board;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/board")
@CrossOrigin
public class BoardController {

	@Autowired
	private BoardServiceImpl service;
	
	// 공지사항 목록 조회
	@GetMapping("/notice")
	public ResponseEntity<?> noticeList() {
		System.out.println("<<< noticeList >>>");
		return new ResponseEntity<>(service.noticeList(), HttpStatus.OK);
	}
	
	
	// 공지 상세 페이지
	@GetMapping("/notice/{notice_no}")
	public ResponseEntity<?> noticeDetail(@PathVariable int notice_no){
		System.out.println("<<< noticeDetail >>> ");
		
		Notice notice = service.noticeDetail(notice_no);
		
		return new ResponseEntity<>(notice, HttpStatus.OK);
	}
	
	// 공지 삭제(notice_delete 컬럼 update로 처리)
	@DeleteMapping("/notice/{notice_no}")
	public ResponseEntity<?> deleteNotice(@PathVariable int notice_no){
		System.out.println("<<< deleteNotice >>> ");
		return new ResponseEntity<>(service.deleteNotice(notice_no), HttpStatus.OK);
	}
	
	// 공지 작성
	@PostMapping("/notice")
	public ResponseEntity<?> insertNotice(@RequestBody Notice notice){
		System.out.println("<<< insertNotice >>> ");
		
		return new ResponseEntity<>(service.insertNotice(notice), HttpStatus.CREATED);
	}
	
	// 공지 수정
	@PutMapping("/notice/{notice_no}")
	public ResponseEntity<?> updateNotice(@RequestBody Notice notice){
		System.out.println("<<< updateNotice >>> ");
		return new ResponseEntity<>(service.updateNotice(notice), HttpStatus.OK);
		}
	
	// 자료 목록 조회
	@GetMapping("/library")
	public ResponseEntity<?> libraryList() {
		System.out.println("<<< libraryList >>>");
		return new ResponseEntity<>(service.libraryList(), HttpStatus.OK);
	}
		
	// 자료 상세 페이지
	@GetMapping("/library/{library_no}")
	public ResponseEntity<?> libraryDetail(@PathVariable int library_no){
		System.out.println("<<< libraryDetail >>> ");
		System.out.println("<<< library_no >>> " + library_no);
					
		Library library = service.libraryDetail(library_no);
		return new ResponseEntity<>(library, HttpStatus.OK);
	}
	
	// 자료 삭제(notice_delete 컬럼 update로 처리)
	@DeleteMapping("/library/{library_no}")
	public ResponseEntity<?> deleteLibrary(@PathVariable int library_no){
		System.out.println("<<< deleteLibrary >>> ");
		return new ResponseEntity<>(service.deleteLibrary(library_no), HttpStatus.OK);
	}
	
	// 자료 작성
	@PostMapping("/library")
	public ResponseEntity<?> insertLibrary(@RequestBody Library library){
		System.out.println("<<< insertLibrary >>> ");
		return new ResponseEntity<>(service.insertLibrary(library), HttpStatus.CREATED);
	}
	
	// 자료 수정
	@PutMapping("/library/{library_no}")
	public ResponseEntity<?> updateLibrary(@RequestBody Library library){
		System.out.println("<<< updateLibrary >>> ");
		return new ResponseEntity<>(service.updateLibrary(library), HttpStatus.OK);
	}
		
}
