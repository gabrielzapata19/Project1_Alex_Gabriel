package com.revature.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.revature.util.RequestViewHelper;

public class ViewServlet extends HttpServlet {

	private static final long serialVersionUID = 2L;
	private static Logger log = Logger.getLogger(ViewServlet.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
		log.info("We are in ViewSerlet");
		
		String nextView = RequestViewHelper.process(req);

		if (nextView != null) {
			try {
				req.getRequestDispatcher(nextView).forward(req, resp);
			} catch (Exception e) {
				log.error(e.getMessage());
				//server error
				resp.setStatus(500);
			}
		} else {
			resp.setStatus(401);
		}

	}

}
