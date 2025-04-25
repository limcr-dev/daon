package com.spring.daon.hrMgt.position;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionServiceImpl {

    @Autowired
    private PositionMapper mapper;

    public List<Position> getAllPositions() {
        return mapper.getAllPositions();
    }

    public Position getPositionById(int id) {
        return mapper.getPositionById(id);
    }

    public int insertPosition(Position position) {
        return mapper.insertPosition(position);
    }

    public int updatePosition(Position position) {
        return mapper.updatePosition(position);
    }

    public int deletePosition(int id) {
        return mapper.deletePosition(id);
    }
}
