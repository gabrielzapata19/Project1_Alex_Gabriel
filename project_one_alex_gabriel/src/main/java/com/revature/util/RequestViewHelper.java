package com.revature.util;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.revature.models.Principal;

public class RequestViewHelper {
	
	private static Logger log = Logger.getLogger(RequestViewHelper.class);
	
	private RequestViewHelper() {
		super();
	}
	
	public static String process(HttpServletRequest request) {
		
		switch(request.getRequestURI()) {
		
		case "/project_one_alex_gabriel/login.view":
			log.info("Getting login.html");
			return "partials/login.html";
		
		case "/project_one_alex_gabriel/register.view":
			log.info("Fetching register.html");
			return "partials/register.html";
		
		case "/project_one_alex_gabriel/employee.view":
			
			Principal principalEmployee = (Principal) request.getAttribute("principal");
			
			if(principalEmployee == null) {
				log.warn("No principal attribute found on request object");
				return null;
			}
			
			log.info("Fetching employee.html");
			return "partials/employee.html";
		
		case "/project_one_alex_gabriel/managers.view":
			
			Principal principalManager = (Principal) request.getAttribute("principal");
			
			if(principalManager == null) {
				log.warn("No principal attribute found on request object");
				return null;
			}
			
			log.info("Fetching managers.html");
			return "partials/managers.html";
			
		case "/project_one_alex_gabriel/reimbursement.view":
			
			Principal principalReimbursement = (Principal) request.getAttribute("principal");
			
			if(principalReimbursement == null) {
				log.warn("No principal attribute found on request object");
				return null;
			}
			
			log.info("Fetching reimbursement.html");
			return "partials/reimbursement.html";
			
		default: 
			log.info("Invalid view requested");
			return null;
		}
	}

}
