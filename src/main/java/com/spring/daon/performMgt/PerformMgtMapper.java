package com.spring.daon.performMgt;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.spring.daon.attendMgt.Attendance;
import com.spring.daon.hrMgt.Employees;

@Mapper
@Repository
public interface PerformMgtMapper {
	
	// 전체리스트 문제 불러오기
	public List<EvalQuesComp> evalQuesList();
	
	// 역량 리스트
	public List<EvalQuesComp> compList();
	
	// 역량을 넣어서 테스트 insert하기
	public int insertTest (Test test);
	
	// 평가 직원 리스트
	public List<EvalQuesComp> evalList();
	
	// 등록된 테스트 리스트
	public List<Test> testListT();
	
	// 저장된 테스트 리스트
	public List<Test> testList();

	// 삭제 테스트 리스트
	public int deleteTest(String eval_order_num);
	
	// 마지막 순번 불러오기(다음번호로 올리기 위합)
	public String selectLastOrderNum();
	
	// test update 등록
	public int updateTest(String eval_order_num);
	
	// update 역량 문제 찾기
	public List<EvalQuesComp> updateFind(String eval_order_num);
	
	// 동료 불러오기
	public List<PeerTarget> peerList(int emp_no) ;
	
	// 동료평가 평가자 피평가자 insert
	public int insertPeerTarget(PeerTarget peerTarget);
	
	// 평가 결과 저장하기 => 동료평가
	public int insertPeerEval(EvalPeer evalPeer);
	
	// 자기평가 리스트 불러오기
	public List<SelfTarget> selfList(int emp_no) ;
		
	// insert 하기  => 자기평가
	public int selfTargetInsert(SelfTarget selfTarget);
	
	// 평가 결과 저장하기 => 자기 평가
	public int insertSelfEval(EvalSelf evalSelf);
	
	// 전체 직원 평가 현황 
	public List<EvalEmployees> evalStatus();
	
	//전체 직원 리스트
	public Employees employees(int emp_no);
	
	//동료평가리스트
	public List<EvalPeer> evalPeer();
	
	// 자기평가 리스트 
	public List<EvalSelf> evalSelf();
	
	// 자기평가 진행 현황(개인용)
	public SelfTarget selfStatusEmp(int emp_no);
	
	// 동료평가 진행 현황 (관리자용)
	public List<PeerTarget> peerStatus();
	
	// 동료평가 진행 현황(개인용)
	public PeerTarget peerStatusEmp(int emp_no);
	
	// 개인별 동료평가 점수
	public List<EvalPeer> peerScore(int emp_no);
	
	// 개인별 자기평가 점수
	public List<EvalSelf> selfScore(int emp_no);
	
	// 개인별 근태 점수
	public List<EvalAttand> attandScore(int emp_no);
	
	// total 근태 점수
	public List<EvalAttand> attandTotalScore();
		
	// 목표설정
	public int addGoal(Goal goal);
	
	// 목표 목록  / 월별 달성
	public List<Goal> getAllGoals(int emp_no); 
	
	// 목표 리스트 (개인)
	public List<Goal> goalsList(int emp_no);
	
	// 목표 달성
	public int completeGoal(Long id);
	
	// 목표 달성률 (개인)
	public List<Goal> totalGoalsScore(int emp_no);
	
	// 목표 달성률 (전체)
	public List<Goal> totalAllGoalsScore();
	
	// 역량별 문제 불러오기
	
	
	// 역량별 문제 등록하기
	
	// 역량별 문제 수정하기
	
	
	// 역량별 문제 삭제하기
	
	// 
	
}
