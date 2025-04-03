package com.spring.daon.login.dto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name="react_login_tbl")
public class UserDTO {
	
	@Id
	@Column(name="id")
	private String id;
	private String password;
	
	@Column(name="first_name")
	private String firstName;  // first_name
	
	@Column(name="last_name")
	private String lastName;   // last_name
	private String token;
	
//	public User() {
//		super();
//	}
//	
//	public User(String id, String password, String firstName, String lastName, String token) {
//		super();
//		this.id = id;
//		this.password = password;
//		this.firstName = firstName;
//		this.lastName = lastName;
//		this.token = token;
//	}
//
//	public String getId() {
//		return id;
//	}
//	
//	public void setId(String id) {
//		this.id = id;
//	}
//	
//	public String getPassword() {
//		return password;
//	}
//	
//	public void setPassword(String password) {
//		this.password = password;
//	}
//	
//	public String getFirstName() {
//		return firstName;
//	}
//	
//	public void setFirstName(String firstName) {
//		this.firstName = firstName;
//	}
//	
//	public String getLastName() {
//		return lastName;
//	}
//	
//	public void setLastName(String lastName) {
//		this.lastName = lastName;
//	}
//	
//	public String getToken() {
//		return token;
//	}
//	
//	public void setToken(String token) {
//		this.token = token;
//	}
}
