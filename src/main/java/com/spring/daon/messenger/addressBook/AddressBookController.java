package com.spring.daon.messenger.addressBook;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.daon.hrMgt.Employees;
import com.spring.daon.paging.Paging;

@RestController
@RequestMapping("/messenger")
@CrossOrigin
public class AddressBookController {
	
	@Autowired
	private AddressBookServiceImpl service;
	
	// http://localhost:8081/messenger/addressBook
	@GetMapping("/addressBook")
	public ResponseEntity<Map<String, Object>> addressBook(
			@RequestParam(defaultValue = "1") int page,
		    @RequestParam(defaultValue = "15") int size,
		    @RequestParam(required = false) String search) {
	    System.out.println("<<< addressBook >>> search : " + search);

	    int totalCount = service.abCount(search);
	    Paging paging = new Paging(page, size, totalCount);

	    List<Employees> result = (search == null || search.trim().isEmpty())
	        ? service.abList(paging.getStartRow(), paging.getSize())
	        : service.searchPerson(search, paging.getStartRow(), paging.getSize());

	    Map<String, Object> response = new HashMap<>();
	    response.put("list", result);
	    response.put("paging", paging);

	    System.out.println("result : " + result);
	    return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
	}
}
