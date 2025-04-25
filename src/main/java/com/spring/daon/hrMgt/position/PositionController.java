package com.spring.daon.hrMgt.position;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/positions")
public class PositionController {

    @Autowired
    private PositionServiceImpl service;

    // 전체 조회
    @GetMapping
    public List<Position> getAll() {
        return service.getAllPositions();
    }

    // 단일 조회
    @GetMapping("/{id}")
    public Position getOne(@PathVariable int id) {
        return service.getPositionById(id);
    }

    // 등록
    @PostMapping
    public int insert(@RequestBody Position position) {
        return service.insertPosition(position);
    }

    // 수정
    @PutMapping
    public int update(@RequestBody Position position) {
        return service.updatePosition(position);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public int delete(@PathVariable int id) {
        return service.deletePosition(id);
    }
}