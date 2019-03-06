--Testing for UserDAO getAll()
SELECT * FROM ers_users JOIN ers_user_roles ON ers_users.user_role_id = ers_user_roles.ers_user_role_id;
--Works!

--Testing for UserDAO getByUsername()
SELECT * FROM ers_users JOIN ers_user_roles ON ers_users.user_role_id = ers_user_roles.ers_user_role_id WHERE ers_username = 'alexj4564';
--Works!

--Testing for UserDAO getByCredentials()
SELECT * FROM ers_users JOIN ers_user_roles ON ers_users.user_role_id = ers_user_roles.ers_user_role_id WHERE ers_username = 'alexj4564' AND ers_password = 'asdf';
--Works!

SELECT * FROM ers_users JOIN ers_user_roles ON ers_users.user_role_id = ers_user_roles.ers_user_role_id WHERE ers_users_id = 1;
--Works!



--Testing for ReimbursementDAO getByAuthor()
SELECT * FROM ers_reimbursement FULL OUTER JOIN ers_reimbursement_status USING (reimb_status_id) FULL OUTER JOIN ers_reimbursement_type USING (reimb_type_id) JOIN ers_users ON ers_reimbursement.reimb_author = ers_users.ers_users_id WHERE reimb_author = 1;
--Works!
