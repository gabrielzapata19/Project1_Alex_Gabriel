package com.revature.models;

public class ReimbursementType {
	
	private int reimbTypeId;
	private String reimbTypeName;
	
	public ReimbursementType() {
		super();
	}
	
	public ReimbursementType(int reimbTypeId) {
		this.reimbTypeId = reimbTypeId;
		
		switch(reimbTypeId) {
		case 1:
			this.reimbTypeName = "lodging"; break;
		case 2:
			this.reimbTypeName = "travel"; break;
		case 3:
			this.reimbTypeName = "food"; break;
		case 4:
			this.reimbTypeName = "other"; break;
		default:
			this.reimbTypeName = null;
		}
	}
	
	public ReimbursementType(String reimbTypeName) {
		super();
		this.reimbTypeName = reimbTypeName;
		
		switch(reimbTypeName) {
		case "lodging":
			this.reimbTypeId = 1; break;
		case "travel":
			this.reimbTypeId = 2; break;
		case "food":
			this.reimbTypeId = 3; break;
		case "other":
			this.reimbTypeId = 4; break;
		default:
			this.reimbTypeId = 4;
		}
	}
	
	public ReimbursementType(int reimbTypeId, String reimbTypeName) {
		super();
		this.reimbTypeId = reimbTypeId;
		this.reimbTypeName = reimbTypeName;
	}

	public int getReimbTypeId() {
		return reimbTypeId;
	}

	public void setReimbTypeId(int reimbTypeId) {
		this.reimbTypeId = reimbTypeId;
	}

	public String getReimbTypeName() {
		return reimbTypeName;
	}

	public void setReimbTypeName(String reimbTypeName) {
		this.reimbTypeName = reimbTypeName;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + reimbTypeId;
		result = prime * result + ((reimbTypeName == null) ? 0 : reimbTypeName.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ReimbursementType other = (ReimbursementType) obj;
		if (reimbTypeId != other.reimbTypeId)
			return false;
		if (reimbTypeName == null) {
			if (other.reimbTypeName != null)
				return false;
		} else if (!reimbTypeName.equals(other.reimbTypeName))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "ReimbursementType [reimbTypeId=" + reimbTypeId + ", reimbTypeName=" + reimbTypeName + "]";
	}
	
}
