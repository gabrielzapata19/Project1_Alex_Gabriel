package com.revature;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

import com.revature.dao.ReimbursementDAO;
import com.revature.dao.UserDAO;
import com.revature.models.Reimbursement;
import com.revature.models.ReimbursementStatus;
import com.revature.models.ReimbursementType;
import com.revature.models.Role;
import com.revature.models.User;


public class TestDriver {
	
	public static void main(String[] args) {
		
		UserDAO userDao = new UserDAO();
		
//		System.out.println(userDao.getAll());
//		System.out.println("+------------------------------+");
//		System.out.println(userDao.getByUsername("alexj4564"));
//		System.out.println("+------------------------------+");
//		System.out.println(userDao.getByCredentials("alexj4564", "asdf"));
//		System.out.println("+------------------------------+");
//		System.out.println(userDao.getById(1));
//		System.out.println("+------------------------------+");
		
//		Role newRole = new Role();
//		newRole.setRoleId(2);
//		newRole.setRoleName("employee");
//		User testUser = new User(0, "BobbyBob", "asdf", "Bobby", "Bob", "bob@gmail.com", newRole);
//		System.out.println(userDao.add(testUser));
		
		
		ReimbursementDAO reimbursementDao = new ReimbursementDAO();
		
//		System.out.println(reimbursementDao.getAll());
//		System.out.println("+------------------------------+");
//		System.out.println(reimbursementDao.getById(3));
//		System.out.println("+------------------------------+");
//		System.out.println(reimbursementDao.getByAuthor(3));
//		System.out.println("+------------------------------+");
		
//		ReimbursementStatus newReimbursementStatus = new ReimbursementStatus();
//		newReimbursementStatus.setReimbStatusId(1);
//		newReimbursementStatus.setReimbStatusName("Approved");
//		ReimbursementType newReimbursementType = new ReimbursementType();
//		newReimbursementType.setReimbTypeId(3);
//		newReimbursementType.setReimbTypeName("food");
//		Reimbursement testReimbursement = new Reimbursement(0, 75, "2019-03-05", "2019-03-05", "I like poop", null, 2, 5, newReimbursementStatus, newReimbursementType);
//		System.out.println(reimbursementDao.add(testReimbursement));
//		
//		testReimbursement.setResolved("2019-03-06");
//		testReimbursement.setResolver(5);
//		newReimbursementStatus.setReimbStatusId(2);
//		testReimbursement.setReimbStatus(newReimbursementStatus);
//		System.out.println(reimbursementDao.update(testReimbursement));
		
	}
}
		
