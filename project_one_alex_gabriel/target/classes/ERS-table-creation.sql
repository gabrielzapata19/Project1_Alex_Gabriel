
DROP TABLE ers_reimbursement;
DROP TABLE ers_users;
DROP TABLE ers_reimbursement_status;
DROP TABLE ers_reimbursement_type;
DROP TABLE ers_user_roles;
DROP SEQUENCE users_pk_seq;
DROP SEQUENCE reimbursement_pk_seq;


CREATE TABLE ers_reimbursement_status (
    reimb_status_id     NUMBER,
    reimb_status        VARCHAR2 (10),
    
    CONSTRAINT reimb_status_pk
    PRIMARY KEY (reimb_status_id)
);

CREATE TABLE ers_reimbursement_type (
    reimb_type_id       NUMBER,
    reimb_type          VARCHAR2 (10),
    
    CONSTRAINT reimb_type_pk
    PRIMARY KEY (reimb_type_id)
);

CREATE TABLE ers_user_roles (
ers_user_role_id      NUMBER,
user_role             VARCHAR2(10),

    CONSTRAINT ers_user_roles_pk 
    PRIMARY KEY (ers_user_role_id)
);

CREATE TABLE ers_users (
ers_users_id        NUMBER,
ers_username        VARCHAR2(50),
ers_password        VARCHAR2(50),
user_first_name     VARCHAR2(100),
user_last_name      VARCHAR2(100),
user_email          VARCHAR2(150),
user_role_id        NUMBER,

    CONSTRAINT ers_users_pk 
    PRIMARY KEY (ers_users_id),
    
    CONSTRAINT ers_users_UNv1 
    UNIQUE(ers_username, user_email),
    
    CONSTRAINT user_role_id
    FOREIGN KEY (user_role_id)
    REFERENCES  ers_user_roles (ers_user_role_id)
);

CREATE TABLE ers_reimbursement (
    reimb_id            NUMBER,
    reimb_amount        NUMBER,
    reimb_submitted     VARCHAR2 (20),
    reimb_resolved      VARCHAR2 (20),
    reimb_description   VARCHAR2 (250),
    reimb_receipt       BLOB,
    reimb_author        NUMBER,
    reimb_resolver      NUMBER,
    reimb_status_id     NUMBER,
    reimb_type_id       NUMBER,
    
    CONSTRAINT ers_reimbursement_pk
    PRIMARY KEY (reimb_id),
    
    CONSTRAINT ers_users_fk_auth
    FOREIGN KEY (reimb_author)
    REFERENCES ers_users (ers_users_id),
    
    CONSTRAINT ers_users_fk_reslvr
    FOREIGN KEY (reimb_resolver)
    REFERENCES ers_users (ers_users_id),
    
    CONSTRAINT ers_reimbursement_status_fk
    FOREIGN KEY (reimb_status_id)
    REFERENCES ers_reimbursement_status (reimb_status_id),
    
    CONSTRAINT ers_reimbursement_type_fk
    FOREIGN KEY (reimb_type_id)
    REFERENCES ers_reimbursement_type (reimb_type_id)
);  

CREATE SEQUENCE users_pk_seq
MINVALUE 1
MAXVALUE 99999999
INCREMENT BY 1
START WITH 1;

CREATE SEQUENCE reimbursement_pk_seq
MINVALUE 1
MAXVALUE 99999999
INCREMENT BY 1
START WITH 1;

CREATE OR REPLACE TRIGGER users_pk_trigger
BEFORE INSERT ON ers_users
FOR EACH ROW
BEGIN
    SELECT users_pk_seq.NEXTVAL
    INTO :new.ers_users_id
    FROM dual;
END;
/

CREATE OR REPLACE TRIGGER reimbursement_pk_trigger
BEFORE INSERT ON ers_reimbursement
FOR EACH ROW
BEGIN
    SELECT reimbursement_pk_seq.NEXTVAL
    INTO :new.reimb_id
    FROM dual;
END;
/

INSERT INTO ers_reimbursement_status VALUES (1, 'pending');
INSERT INTO ers_reimbursement_status VALUES (2, 'approved');
INSERT INTO ers_reimbursement_status VALUES (3, 'denied');

INSERT INTO ers_reimbursement_type VALUES (1, 'lodging');
INSERT INTO ers_reimbursement_type VALUES (2, 'travel');
INSERT INTO ers_reimbursement_type VALUES (3, 'food');
INSERT INTO ers_reimbursement_type VALUES (4, 'other');

INSERT INTO ers_user_roles VALUES (1, 'manager');
INSERT INTO ers_user_roles VALUES (2, 'employee');

INSERT INTO ers_users VALUES (0, 'alexj4564', 'asdf', 'Alex', 'Johnson', 'alexjohnson4564@gmail.com', 2);
INSERT INTO ers_users VALUES (0, 'zapata', '1234', 'Gabe', 'Zapata', 'gzapata@gmail.com', 1);
INSERT INTO ers_users VALUES (0, 'KingInTheNorth', 'knowsnothing', 'Jon', 'Snow', 'Iknownothing@gmail.com', 2);
INSERT INTO ers_users VALUES (0, 'StanDarsh', 'asdf', 'Stan', 'Marsh', 'morelikeStanDarsh@gmail.com', 2);
INSERT INTO ers_users VALUES (0, 'SlimJimTim', 'asdf', 'Jim', 'Tim', 'slimjimtim@gmail.com', 1);

INSERT INTO ers_reimbursement VALUES (0, 50, '2019-03-01', '2019-03-01', 'I had a steak dinner. Sue me.', null, 1, 2, 3, 3);
INSERT INTO ers_reimbursement VALUES (0, 300, '2019-03-01', '2019-03-01', 'I flew to a place and back.', null, 1, 2, 2, 2);
INSERT INTO ers_reimbursement VALUES (0, 80, '2019-03-01', '2019-03-02', 'I rode to the Wall because Winter is coming!', null, 3, 2, 3, 2);
INSERT INTO ers_reimbursement VALUES (0, 200, '2019-03-02', '2019-03-02', 'I stayed in a hotel.', null, 4, 2, 2, 1);
INSERT INTO ers_reimbursement VALUES (0, 65, '2019-03-02', '2019-03-03', 'I stayed in a motel.', null, 5, 2, 2, 1);
INSERT INTO ers_reimbursement VALUES (0, 116, '2019-03-03', null, 'I stayed in a Holiday Inn.', null, 1, null, 1, 1);
INSERT INTO ers_reimbursement VALUES (0, 10000, '2019-03-03', null, 'I was stabbed to death and had to be resurrected.', null, 3, null, 1, 4);
INSERT INTO ers_reimbursement VALUES (0, 55, '2019-03-03', null, 'Steak again.', null, 1, null, 1, 3);

commit; 

CREATE OR REPLACE PROCEDURE get_all_reimbursements
    (
        my_cursor OUT SYS_REFCURSOR
    )
IS
BEGIN
    OPEN my_cursor FOR
    SELECT *
    FROM ers_reimbursement
    JOIN ers_reimbursement_status
    USING (reimb_status_id)
    JOIN ers_reimbursement_type
    USING (reimb_type_id)
    JOIN ers_users
    ON ers_reimbursement.reimb_author = ers_users.ers_users_id
    ORDER BY reimb_id DESC;
END;
/




