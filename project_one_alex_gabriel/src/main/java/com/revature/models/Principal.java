package com.revature.models;

public class Principal {
	
	//JWT will take a string for the id and Role
	private String id;
	private String role;
	
	public Principal() {
		super();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	@Override
	public String toString() {
		return "Principal [id=" + id + ", role=" + role + "]";
	}

}
