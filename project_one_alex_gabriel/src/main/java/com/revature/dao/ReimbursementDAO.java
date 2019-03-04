package com.revature.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.revature.models.Reimbursement;
import com.revature.models.ReimbursementStatus;
import com.revature.models.ReimbursementType;
import com.revature.models.Role;
import com.revature.util.ConnectionFactory;

import oracle.jdbc.internal.OracleTypes;

public class ReimbursementDAO implements DAO<Reimbursement> {
	
	private static Logger log = Logger.getLogger(ReimbursementDAO.class);
	
	@Override
	public List<Reimbursement> getAll() {

		List<Reimbursement> reimbursements = new ArrayList<>();

		try (Connection conn = ConnectionFactory.getInstance().getConnection()) {

			CallableStatement cstmt = conn.prepareCall("{CALL get_all_reimbursements(?)}");
			cstmt.registerOutParameter(1, OracleTypes.CURSOR);
			cstmt.execute();

			ResultSet rs = (ResultSet) cstmt.getObject(1);
			reimbursements = this.mapResultSet(rs);

		} catch (SQLException e) {
			log.error(e.getMessage());
		}

		return reimbursements;
	}
	
	@Override
	public Reimbursement getById(int reimbId) {
		
		Reimbursement reimbursement = new Reimbursement();

		try (Connection conn = ConnectionFactory.getInstance().getConnection()) {

			PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM ers_reimbursement WHERE reimb_id = ?");
			pstmt.setInt(1, reimbId);

			ResultSet rs = pstmt.executeQuery();
			reimbursement = this.mapResultSet(rs).get(0);

		} catch (SQLException e) {
			log.error(e.getMessage());
		}

		return reimbursement;
	}
	
	public List<Reimbursement> getByAuthor(int author) {
		
		List<Reimbursement> reimbursementsList = new ArrayList<>();
		
		try(Connection conn = ConnectionFactory.getInstance().getConnection()) {
			
			String sql = "SELECT * FROM ers_reimbursement JOIN ers_reimbursement_status USING (reimb_status_id) JOIN ers_reimbursement_type USING (reimb_type_id) JOIN ers_users ON ers_reimbursement.reimb_author = ers_users.ers_users_id WHERE reimb_author = ?";
			
			PreparedStatement pstmt = conn.prepareStatement(sql);
			
			pstmt.setInt(1, author);
			
			ResultSet rs = pstmt.executeQuery();
			
			while(rs.next()) {
				Reimbursement temp = new Reimbursement();
				temp.setId(rs.getInt("reimb_id"));
				temp.setAmount(rs.getInt("reimb_amount"));
				temp.setSubmitted(rs.getString("reimb_submitted"));
				temp.setResolved(rs.getString("reimb_resolved"));
				temp.setDescription(rs.getString("reimb_description"));
				temp.setReceipt(rs.getObject("reimb_receipt"));
				temp.setAuthor(rs.getInt("reimb_author"));
				temp.setResolver(rs.getInt("reimb_resolver"));
				temp.setReimbStatus(new ReimbursementStatus(rs.getInt("reimb_status_id")));
				temp.setReimbType(new ReimbursementType(rs.getInt("reimb_type_id")));
				reimbursementsList.add(temp);
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return reimbursementsList;
	}
	
	@Override
	public Reimbursement add(Reimbursement newReimbursement) {
		
		try(Connection conn = ConnectionFactory.getInstance().getConnection()) {
			
			conn.setAutoCommit(false);
			
			String sql = "INSERT INTO ers_reimbursement VALUES (0, ?, ?, null, ?, null, ?, null, 1, ?)";
			
			String[] keys = new String[1];
			keys[0] = "reimb_id";
			
			PreparedStatement pstmt = conn.prepareStatement(sql, keys);
			pstmt.setInt(1, newReimbursement.getAmount());
			pstmt.setString(2, newReimbursement.getSubmitted());
			pstmt.setString(3, newReimbursement.getDescription());
			pstmt.setInt(4, newReimbursement.getAuthor());
			pstmt.setInt(5, newReimbursement.getReimbType().getReimbTypeId());
			
			int rowsInserted = pstmt.executeUpdate();
			ResultSet rs = pstmt.getGeneratedKeys();
			
			if(rowsInserted != 0) {
				
				while(rs.next()) {
					newReimbursement.setId(rs.getInt(1));
				}
				
				conn.commit();
				
			}
					
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		if(newReimbursement.getId() == 0) return null;
		
		return newReimbursement;
	}
	
	@Override
	public Reimbursement update(Reimbursement updatedReimbursement) {
		
		//when a reimbursement is updated, the 'resolved', 'resolver', and 'status' fields
		//of the reimbursement will be updated (and nothing else)
		
		return null; //this is just a placeholder for now so that the un-implemented method doesn't yell at us
	}
	
	@Override
	public boolean delete(int reimbId) {
		return false;
	}
	
	private List<Reimbursement> mapResultSet(ResultSet rs) throws SQLException {
		
		List<Reimbursement> reimbursements = new ArrayList<>();
		
		while(rs.next()) {
			Reimbursement reimbursement = new Reimbursement();
			reimbursement.setId(rs.getInt("reimb_id"));
			reimbursement.setAmount(rs.getInt("reimb_amount"));
			reimbursement.setSubmitted(rs.getString("reimb_submitted"));
			reimbursement.setResolved(rs.getString("reimb_resolved"));
			reimbursement.setDescription(rs.getString("reimb_description"));
			reimbursement.setReceipt(rs.getObject("reimb_receipt"));
			reimbursement.setAuthor(rs.getInt("reimb_author"));
			reimbursement.setResolver(rs.getInt("reimb_resolver"));
			reimbursement.setReimbStatus(new ReimbursementStatus(rs.getInt("reimb_status_id")));
			reimbursement.setReimbType(new ReimbursementType(rs.getInt("reimb_type_id")));
			reimbursements.add(reimbursement);
		}
		
		return reimbursements;
	}
}
