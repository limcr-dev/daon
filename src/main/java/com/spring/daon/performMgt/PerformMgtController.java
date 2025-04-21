package com.spring.daon.performMgt;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
@RequestMapping("/performMgt")
@CrossOrigin
public class PerformMgtController {
	
	@Autowired
	private PerformMgtServiceImpl service;
	
	// 문제 리스트 페이지 
	@GetMapping("/queslist")
	public ResponseEntity<?> findAll(){
		System.out.println("<<<<<문제리스트??");
		
		
		return new ResponseEntity<>(service.evalQuesList(), HttpStatus.OK);	// 200
	}
	
	// 문제 리스트 페이지 => 선택한 문제 리스트
	@GetMapping("/queslist/{eval_order_num}")
	public ResponseEntity<?> selectTest(@PathVariable String eval_order_num){
		System.out.println("<<< 역량 선택한 문제 리스트 >>>" + eval_order_num);

		return new ResponseEntity<>(service.selectTest(eval_order_num), HttpStatus.OK);
		
	}
	
	// 역량 리스트
	@GetMapping("/compList")
	public ResponseEntity<?> findCompAll(){
		System.out.println("<<<<<역량 리스트 >>>");
		
		return new ResponseEntity<>(service.compList(), HttpStatus.OK);	// 200
	}
	
	// 역량 넘기면서 insert(인사평가 담당이 세팅 )
	@PostMapping("/insertComp")
	public ResponseEntity<?> insertTest(@RequestBody Test test){
		System.out.println("<<< test 세팅 >>>");
		System.out.println("🔥 insertComp 요청 도착!");
	    System.out.println("📦 받은 데이터: " + test);
		
	return new ResponseEntity<>(service.insertTest(test), HttpStatus.CREATED); 
	}
	
	// 평가 직원 리스트
	@GetMapping("/evalList")
	public ResponseEntity<?> findEvalList(){
		System.out.println("<<< 평가 직원 리스트 세팅 >>>");
		
		return new ResponseEntity<>(service.evalList(), HttpStatus.OK);	// 200
	}
	
	// 등록된 테스트 리스트
	@GetMapping("/testListT")
	public ResponseEntity<?> findTestT(){
		System.out.println("<<< 평가 직원 리스트 세팅 >>>");
		
		return new ResponseEntity<>(service.testListT(), HttpStatus.OK);	// 200
	}
	
	// 저장된 테스트 리스트
	@GetMapping("/testList")
	public ResponseEntity<?> findTestAll(){
		System.out.println("<<< 저장된 테스트 리스트 >>>");
		
		return new ResponseEntity<>(service.testList(), HttpStatus.OK);	// 200
	}
	
	// 삭제 테스트 리스트
	@DeleteMapping("/testList/{eval_order_num}")
	public ResponseEntity<?> deleteTest(@PathVariable String eval_order_num){
		System.out.println("<<< 삭제 테스트 >>>");
		System.out.println(eval_order_num);
		return new ResponseEntity<>(service.deleteTest(eval_order_num), HttpStatus.OK);	// 200
	}
	
	// 마지막 순번 불러오기(다음번호로 올리기 위합)
	@GetMapping("/lastOrderNum")
	public ResponseEntity<?> findLastOrderNum(){
		System.out.println("<<< 마지막 번호 >>>");
		
		String lastNum = service.findLastOrderNum();   // 실제 서비스에서 번호 받아오기
		Map<String, String> result = new HashMap<>();
		result.put("lastOrderNum", lastNum);
		
		return new ResponseEntity<>(lastNum, HttpStatus.OK);	// 200
	}
	
	// update 역량별 테스리스트를 update
	@PutMapping("/testList/{eval_order_num}")
	public ResponseEntity<?> updateTest(@PathVariable String eval_order_num){
		System.out.println("<<< update 테스트 >>>");
		
		return new ResponseEntity<>(service.updateTest(eval_order_num), HttpStatus.OK);	// 200
	}
	
	// select 역량별 테스리스트를 select -- 이것을 나중에 테스트 불러오는것으로
	@GetMapping("/testList/{eval_order_num}")
	public ResponseEntity<?> updateFind(@PathVariable String eval_order_num){
		System.out.println("<<< update 테스트 찾기? >>>" + eval_order_num);
		
		return new ResponseEntity<>(service.updateFind(eval_order_num), HttpStatus.OK);	// 200
	}
	
	
	// 동료 불러오기 
	@GetMapping("/peerList")
	public ResponseEntity<?> peerList(){
		System.out.println("<< 동료 불러오기 >>");
		
		return new ResponseEntity<>(service.peerList(), HttpStatus.OK);	// 200
	}
	
	// 평가 결과 저장하기
	@PostMapping("/evalPeerInsert")
	public ResponseEntity<?> insertPeerEval(@RequestBody EvalPeer evalPeer) {
		System.out.println("<< 평가 결과 저장하기 >>");
	    return new ResponseEntity<>(service.insertPeerEval(evalPeer), HttpStatus.CREATED);
	}
	
	
	// 평가 관리 리스트
	
	
	// 평가 항목 선택
	
}
