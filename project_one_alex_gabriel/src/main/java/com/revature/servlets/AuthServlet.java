package com.revature.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import com.revature.models.User;
import com.revature.services.UserService;
import com.revature.util.JwtConfig;
import com.revature.util.JwtGenerator;

public class AuthServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(AuthServlet.class);
	
	private final  UserService userService = new UserService();
	
	protected void doPost(HttpServletResponse resp, HttpServletRequest req) throws IOException, ServletException{
		
		ObjectMapper mapper = new ObjectMapper();
		String[] creds = null;
		
		try {
			creds = mapper.readValue(req.getInputStream(), String[].class);
		}catch (MismatchedInputException mie) {
			log.error(mie.getMessage());
			resp.setStatus(400);
			return;
		} catch (Exception e) {
			log.error(e.getMessage());
			resp.setStatus(500);
			return;
		}
		//check if number of credentials is equal to 2 
		if(creds != null && creds.length != 2) {
			log.warn("Invalid number of credentials entered");
			resp.setStatus(400);
			return;
		}
		User user = userService.getByCredentials(creds[0], creds[1]);
		
		if(user == null) {
			resp.setStatus(401);
			return;
		}
		
		//
		resp.setStatus(200);
		resp.addHeader(JwtConfig.HEADER, JwtConfig.PREFIX + JwtGenerator.createJwt(user));
		
	}
		
	
	
	
	
	
	
	
	
	
	
	
}
