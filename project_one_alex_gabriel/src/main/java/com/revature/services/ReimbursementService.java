package com.revature.services;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.revature.dao.ReimbursementDAO;
import com.revature.models.Reimbursement;

public class ReimbursementService {

	private static Logger log = Logger.getLogger(ReimbursementService.class);
	
	private ReimbursementDAO reimDao = new ReimbursementDAO();
	
	
	public List<Reimbursement> getAllReimbursements(Reimbursement managerReimbursement){
		
		List<Reimbursement> reimList = new ArrayList<>();
		//check if manager is the one accessing all reimbursements 
		if(managerReimbursement.getAuthor() == 2) {
			return reimDao.getAll();
		}
		return reimList;
	}
	
	public Reimbursement getById(int reimbId) {
		return reimDao.getById(reimbId);
	}
	
	public List<Reimbursement> getByAuthor(int reimAuthor) {
		
		return reimDao.getByAuthor(reimAuthor);
	}
	
	
	
	public Reimbursement addReim(Reimbursement newReimbursement) {
		if(newReimbursement.getId() == 0 || newReimbursement.getAmount() == 0 || newReimbursement.getSubmitted().equals("") 
				|| newReimbursement.getResolved().equals("") || newReimbursement.getDescription().equals("") || newReimbursement.getAuthor() == 0
				|| newReimbursement.getResolver() == 0 || newReimbursement.getReimbStatus().equals(null) || newReimbursement.getReimbType().equals(null)) {
			log.info("Updated Reimbursement has empty fields!");
			return null;
		}
		return reimDao.add(newReimbursement);
	}
	
	
	
	
	public Reimbursement updateReim(Reimbursement updatedReimbursement) {
		
		//check if all fields are not empty, except for receipt
		if(updatedReimbursement.getId() == 0 || updatedReimbursement.getAmount() == 0 || updatedReimbursement.getSubmitted().equals("") 
				|| updatedReimbursement.getResolved().equals("") || updatedReimbursement.getDescription().equals("") || updatedReimbursement.getAuthor() == 0
				|| updatedReimbursement.getResolver() == 0 || updatedReimbursement.getReimbStatus().equals(null) || updatedReimbursement.getReimbType().equals(null)) {
			log.info("Updated Reimbursement has empty fields!");
			return null;
		}
		
		
		//Attempt to update updatedReimbursement on to database
		Reimbursement persistedReimbursement = reimDao.update(updatedReimbursement);
		
		//Verify if update was successful
		if(persistedReimbursement != null) {
			return updatedReimbursement;
		}
		
		//if update was unsuccessful return null 
		log.warn("Reimbursement update failed");
		return null;
	}
	
	public boolean delete(int Reimbursement) {
		return false;
	}
	
	
	
}