package com.revature;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import com.revature.dao.UserDAO;


public class TestDriver {
	
	public static void main(String[] args) {
		
		UserDAO userDao = new UserDAO();
		
		System.out.println(userDao.getAll());
		System.out.println("+------------------------------+");
		System.out.println(userDao.getByUsername("alexj4564"));
		System.out.println("+------------------------------+");
		System.out.println(userDao.getByCredentials("alexj4564", "asdf"));
		System.out.println("+------------------------------+");
		System.out.println(userDao.getById(1));
		
	BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
	System.out.print("Please provide an id number: ");
	String input = null;
	try {
		input = br.readLine();
	} catch (IOException e) {
		e.printStackTrace();
	}
	System.out.println(userDao.getById(Integer.parseInt(input)));
	
	
	}
	
}
		
