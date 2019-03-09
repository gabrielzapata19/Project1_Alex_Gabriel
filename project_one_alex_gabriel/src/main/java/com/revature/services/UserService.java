package com.revature.services;

import java.util.List;

import org.apache.log4j.Logger;

import com.revature.dao.UserDAO;
import com.revature.models.User;


public class UserService {

	private static Logger log = Logger.getLogger(UserService.class);
	
	private UserDAO userDao = new UserDAO();
	
	public List<User> getAll() {
		return userDao.getAll();
	}

	public User getById(int userId) {
		return userDao.getById(userId);
	}

	public User getByUsername(String username) {
		return userDao.getByUsername(username);
	}

	public User getByCredentials(String username, String password) {

		User user = null;
		
		// Verify that neither of the credentials are empty string
		if (!username.equals("") && !password.equals("")) {
			user = userDao.getByCredentials(username, password);
			if(user != null) {
				return user;
			}
		}
		
		log.info("Username and/or password is empty!");
		return null;
	}
	
	public User add(User newUser) {

		// Verify that there are no empty fields
		if (newUser.getUsername().equals("") || newUser.getPassword().equals("") || newUser.getFirstName().equals("")
				|| newUser.getLastName().equals("") || newUser.getEmail().equals("")){
			log.info("New User had empty fields!");
			return null;
		}

		return userDao.add(newUser);
	}
	
	public User update(User updatedUser) {

		// Verify that there are no empty fields
		if (updatedUser.getUsername().equals("") || updatedUser.getPassword().equals("")
				|| updatedUser.getFirstName().equals("") || updatedUser.getLastName().equals("") || updatedUser.getEmail().equals("")) {
			log.info("Updated User had empty fields!");
			return null;
		}
		
		// Attempt to persist the user to the dataset
		User persistedUser = userDao.update(updatedUser);
		

		// If the update attempt was successful, update the currentUser of AppState, and return the updatedUser
		if (persistedUser != null) {
			return updatedUser;
		}

		// If the update attempt was unsuccessful, return null
		return null;
	}
	
	public boolean delete(int userId) {
		return false;
	}
	
}
