package com.spring.daon.hrMgt.position;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PositionMapper {

    // 전체 목록 조회
    List<Position> getAllPositions();

    // 단일 조회
    Position getPositionById(int position_id);

    // 등록
    int insertPosition(Position positionDTO);

    // 수정
    int updatePosition(Position positionDTO);

    // 삭제
    int deletePosition(int position_id);
}