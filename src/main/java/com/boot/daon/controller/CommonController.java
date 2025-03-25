package com.boot.daon.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequestMapping("/api")
@RestController
@CrossOrigin
public class CommonController {
	
	@GetMapping("/Home")
	public Home() {
		System.out.println("SignUp");
		return (); 
	}



}
