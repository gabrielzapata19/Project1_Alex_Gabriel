package com.revature.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import com.revature.models.Principal;
import com.revature.models.Reimbursement;
import com.revature.services.ReimbursementService;

@WebServlet("/reimbursements/*")
public class ReimbursementServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(UserServlet.class);
	
	private final ReimbursementService reimService = new ReimbursementService();
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		Principal principal = (Principal) req.getAttribute("principal");
		
		String requestURI = req.getRequestURI();
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			PrintWriter out = resp.getWriter();
			
			if(principal == null) {
				log.warn("No principal attribute found on request");
				resp.setStatus(401);
				return;
			}
			
			if(requestURI.equals("/project_one_alex_gabriel/reimbursements") || requestURI.equals("/project_one_alex_gabriel/reimbursements/")) {
				
				if (!principal.getRole().equalsIgnoreCase("manager")) {
					System.out.println("Hello!");
					List<Reimbursement> reimbursement = reimService.getByAuthor(Integer.parseInt(principal.getId()));
					String reimJSON = mapper.writeValueAsString(reimbursement);
					resp.setStatus(200);
					out.write(reimJSON);
				} else {
					List<Reimbursement> reim = reimService.getAll();
					String reimJSON = mapper.writeValueAsString(reim);
					resp.setStatus(200);
					out.write(reimJSON);
				}	
			} 
			
		} catch (NumberFormatException nfe) {
				log.error(nfe.getMessage());
				resp.setStatus(400);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
			resp.setStatus(500);
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
		log.info("Request received by ReimbursementServlet.doPost()");
		Reimbursement someReimbursement = null;
		
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			someReimbursement = mapper.readValue(req.getInputStream(), Reimbursement.class);
		} catch (MismatchedInputException mie) {
			log.error(mie.getMessage());
			resp.setStatus(400);
			return;
		} catch (Exception e) {
			log.error(e.getMessage());
			resp.setStatus(500);
			return;
		}
	
		if(someReimbursement.getReimbStatus().getReimbStatusName().equals("pending")) {
			someReimbursement = reimService.add(someReimbursement);
		} else {
			someReimbursement = reimService.update(someReimbursement);
		}
		
		try {
			String userJson = mapper.writeValueAsString(someReimbursement);
			PrintWriter out = resp.getWriter();
			out.write(userJson);
		} catch (Exception e) {
			log.error(e.getMessage());
			resp.setStatus(500);
		}
	}
	
}

