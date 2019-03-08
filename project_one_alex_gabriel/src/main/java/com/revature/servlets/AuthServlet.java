package com.revature.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
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

@WebServlet("/auth")
public class AuthServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(AuthServlet.class);
	
	private final UserService userService = new UserService();
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
		ObjectMapper mapper = new ObjectMapper();
		String[] credentials = null;
//		System.out.println(req.getInputStream());
//		System.out.println(mapper.readValue(req.getInputStream(), String[].class));
		try {
			credentials = mapper.readValue(req.getInputStream(), String[].class);
			
		} catch (MismatchedInputException mie) {
			log.error(mie.getMessage());
			resp.setStatus(400);
			return;
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
			resp.setStatus(500);
			return;
		}
		
		if(credentials != null && credentials.length != 2) {
			log.warn("Invalid request, unexpected number of credential values");
			resp.setStatus(400);
			return;
		}
		
		User user = userService.getByCredentials(credentials[0], credentials[1]);
		
		if(user == null) {
			resp.setStatus(401);
			return;
		}
		
		resp.setStatus(200);
		resp.addHeader(JwtConfig.HEADER, JwtConfig.PREFIX + JwtGenerator.createJwt(user));
	}
}
