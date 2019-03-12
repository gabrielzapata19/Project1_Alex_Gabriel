
window.onload = function() {
    loadLogin();
}

/*
    Login component
        - loadLogin()
        - configureLogin()
        - login()
*/

async function loadLogin() {
    console.log('in loadLogin()');
    
    APP_VIEW.innerHTML = await fetchView('login.view');
    DYNAMIC_CSS_LINK.href = 'css/login.css';
    configureLogin();
}

function configureLogin() {
    console.log('in configureLogin()');
    localStorage.clear();
    document.getElementById('alert-msg').hidden = true;
    document.getElementById('submit-creds').addEventListener('click', login);
    document.getElementById('register-button').addEventListener('click', loadRegister);
}

async function login() {
    console.log('in login()');
    let credentials = [];
    credentials.push(document.getElementById('username-cred').value);
    credentials.push(document.getElementById('password-cred').value);

    let response = await fetch('auth', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    if(response.status == 200) {
        document.getElementById('alert-msg').hidden = true;
        localStorage.setItem('jwt', response.headers.get('Authorization'));
        getDashboard();
    } else {
        document.getElementById('alert-msg').hidden = false;
    }
}

async function getDashboard() {
	
	let response = await fetch('users',{
		method: 'GET',
		mode: 'cors',
		headers: {
			'Authorization' : localStorage.getItem('jwt')
		}	
	});
	
    let results = await response.json();

    if (results.constructor === Array) {
        loadManager();
    } else {
        loadEmployee();
    }
} 

//-----------------------------------------------------------------------------------------

/*
    Register component

        - loadRegister()
        - configureRegister()
        ...
        ...
        ...
        - register()
*/

async function loadRegister() {
    console.log('in loadRegister()');
    APP_VIEW.innerHTML = await fetchView('register.view');
    DYNAMIC_CSS_LINK.href = 'css/register.css';
    configureRegister();
}

function configureRegister() {
    console.log('in configureRegister()');
    document.getElementById('alert-msg-registration').hidden = true;
    document.getElementById('registration-success').hidden = true;
    document.getElementById('register-username').addEventListener('blur', validateUsername);
    document.getElementById('register-password').addEventListener('blur', validatePassword);
    document.getElementById('register-first-name').addEventListener('blur', validateFirstName);
    document.getElementById('register-last-name').addEventListener('blur', validateLastName);
    document.getElementById('register-email').addEventListener('blur', validateEmail);
    document.getElementById('register-account').addEventListener('click', register);
    
    document.getElementById('register-password').disabled = true;
    document.getElementById('register-first-name').disabled = true;
    document.getElementById('register-last-name').disabled = true;
    document.getElementById('register-email').disabled = true;
    document.getElementById('register-account').disabled = true;
}

function validateUsername(event) {
	if(event.target.value.length < 4 ){
        document.getElementById('register-account').disabled = true;
    }
    else{
        document.getElementById('register-password').disabled = false;
    }
}

function validatePassword(event) {
	if(event.target.value.length < 4 ){
        document.getElementById('register-account').disabled = true;
    }
    else{
        document.getElementById('register-first-name').disabled = false;
    }
}

function validateFirstName(event) {
	if(!(/^[a-zA-Z ]+$/.test(event.target.value))){
		document.getElementById('register-account').disabled = true;
    }
    else{
        document.getElementById('register-last-name').disabled = false;
    }
}

function validateLastName(event) {
	if(!(/^[a-zA-Z ]+$/.test(event.target.value))){
		document.getElementById('register-account').disabled = true;
    }
    else{
        document.getElementById('register-email').disabled = false;
    }
}

function validateEmail(event) {
	if(!(/\S+@\S+\.\S+/.test(event.target.value))){
        document.getElementById('register-account').disabled = true;
    }else{
        document.getElementById('register-account').disabled = false;
    }
}

async function register() {
    console.log('in register()');
    
    let newUser = {
        id: 0,
        username: document.getElementById('register-username').value,
        password: document.getElementById('register-password').value,
        firstName: document.getElementById('register-first-name').value,
        lastName: document.getElementById('register-last-name').value,
        email: document.getElementById('register-email').value,
        role: {}
    };

    let response = await fetch('users', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    });

    let responseBody = await response.json();

    if(responseBody != null) {
        
    	document.getElementById('alert-msg-registration').hidden = true;
        document.getElementById('registration-success').hidden = false;
        setTimeout(loadLogin, 3000);
        
    } else {
    	document.getElementById('alert-msg-registration').hidden = false;
    }

}

//-------------------------------------------------------------------------------------

/*
    Employee component
 */

async function loadEmployee() {
    console.log('in loadEmployee()');
    APP_VIEW.innerHTML = await fetchView('employee.view');
    DYNAMIC_CSS_LINK.href = 'css/employee.css';
    getCurrentUserReimRequests();
    configureEmployee();
}

function configureEmployee() {
    console.log('in configureEmployee()');
    document.getElementById('new-reim-request').addEventListener('click',loadReimbursement);
    document.getElementById('logout').addEventListener('click', loadLogin);
    document.getElementById('logout-again').addEventListener('click', loadLogin);
}

async function getCurrentUserReimRequests() {
	
	let response = await fetch('reimbursements',{
		method: 'GET',
		mode: 'cors',
		headers: {
			'Authorization' : localStorage.getItem('jwt')
		}
		
	});
	
	let results = await response.json();
	console.log(results);
	createResultsContainer(results);
} 

function createResultsContainer(results) {
    console.log('in createResultsContainer');
    
    for(let i=0; i < results.length; i++) {

        let row = document.createElement('tr');
        let reimbIdCell = document.createElement('td');
        let amountCell = document.createElement('td');
        let submittedCell = document.createElement('td');
        let resolvedCell = document.createElement('td');
        let descriptionCell = document.createElement('td');
        let statusCell = document.createElement('td');
        let typeCell = document.createElement('td');

        row.appendChild(reimbIdCell);
        row.appendChild(amountCell);
        row.appendChild(submittedCell);
        row.appendChild(resolvedCell);
        row.appendChild(descriptionCell);
        row.appendChild(statusCell);
        row.appendChild(typeCell);

        document.getElementById('employee-reimbursements').appendChild(row);

        reimbIdCell.innerText = results[i].id;
        amountCell.innerText = results[i].amount;
        submittedCell.innerText = results[i].submitted;
        if(results[i].resolved == null) {
            resolvedCell.innerText = 'pending';
        } else {
            resolvedCell.innerText = results[i].resolved;
        }
        descriptionCell.innerText = results[i].description;
        statusCell.innerText = results[i].reimbStatus.reimbStatusName;
        typeCell.innerText = results[i].reimbType.reimbTypeName;
    }
}

/*
    Manager component
 */

async function loadManager() {
    console.log('in loadManager()');
    APP_VIEW.innerHTML = await fetchView('manager.view');
    DYNAMIC_CSS_LINK.href = 'css/manager.css';
    getAllReimRequests();
    configureManager();
}

function configureManager() {
    console.log('in configureManager()');
    document.getElementById('view-all').addEventListener('click', getDashboard);
    document.getElementById('view-by-employee').addEventListener('click', viewByEmployee);
    document.getElementById('new-reim-request').addEventListener('click',loadReimbursement);
    document.getElementById('logout').addEventListener('click', loadLogin);
    document.getElementById('logout-again').addEventListener('click', loadLogin);
}

async function getAllReimRequests() {
	
	let response = await fetch('reimbursements',{
		method: 'GET',
		mode: 'cors',
		headers: {
			'Authorization' : localStorage.getItem('jwt')
		}
		
	});
	
	let results = await response.json();
    console.log(results);
    
    getUsersInfo(results);
} 

async function getUsersInfo(results) {
	
    let response = await fetch('users',{
        method: 'GET',
        mode: 'cors',
        headers: {
            'Authorization' : localStorage.getItem('jwt')
        }	
    });
    
    let resultsTwo = await response.json();
    console.log(resultsTwo);

    createResultsContainerTwo(results, resultsTwo);
}	

function createResultsContainerTwo(results, resultsTwo) {
    console.log('in createResultsContainer');
    
    for(let i=0; i < results.length; i++) {

        let row = document.createElement('tr');
        row.innerHTML = `<tr id = table-row${i}></tr>`;
        document.getElementById(`table-row${i}`);

        let reimbIdCell = document.createElement('td');
        reimbIdCell.innerHTML = `<tr id = reimb-id-cell${i}></tr>`;
        document.getElementById(`reimb-id-cell${i}`);
        let firstNameCell = document.createElement('td');
        let lastNameCell = document.createElement('td');
        let amountCell = document.createElement('td');
        amountCell.innerHTML = `<tr id = amount-cell${i}></tr>`;
        document.getElementById(`amount-cell${i}`);
        let submittedCell = document.createElement('td');
        submittedCell.innerHTML = `<tr id = submitted-cell${i}></tr>`;
        document.getElementById(`submitted-cell${i}`);
        let resolvedCell = document.createElement('td');
        let descriptionCell = document.createElement('td');
        descriptionCell.innerHTML = `<tr id = description-cell${i}></tr>`;
        document.getElementById(`description-cell${i}`);
        let authorCell = document.createElement('td');
        authorCell.innerHTML = `<tr id = author-cell${i}></tr>`;
        document.getElementById(`author-cell${i}`);
        let resolverCell = document.createElement('td');
        let statusCell = document.createElement('td');
        let typeCell = document.createElement('td');
        typeCell.innerHTML = `<tr id = type-cell${i}></tr>`;
        document.getElementById(`type-cell${i}`);
        let approveCell = document.createElement('td');
        let denyCell = document.createElement('td');

        row.appendChild(reimbIdCell);
        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(amountCell);
        row.appendChild(submittedCell);
        row.appendChild(resolvedCell);
        row.appendChild(descriptionCell);
        row.appendChild(authorCell);
        row.appendChild(resolverCell);
        row.appendChild(statusCell);
        row.appendChild(typeCell);
        row.appendChild(approveCell);
        row.appendChild(denyCell);

        document.getElementById('employee-reimbursements').appendChild(row);

        reimbIdCell.innerText = results[i].id;
        for(let j=0; j < resultsTwo.length; j++) {
            if(resultsTwo[j].id == results[i].author) {
                firstNameCell.innerText = resultsTwo[j].firstName;
                lastNameCell.innerText = resultsTwo[j].lastName;
            }
        }
        amountCell.innerText = results[i].amount;
        submittedCell.innerText = results[i].submitted;
        if(results[i].resolved == null) {
            resolvedCell.innerText = 'pending';
        } else {
            resolvedCell.innerText = results[i].resolved;
        }
        descriptionCell.innerText = results[i].description;
        authorCell.innerText = results[i].author;
        if(results[i].resolver > 0) {
            resolverCell.innerText = results[i].resolver;
        } else {
            resolverCell.innerText = 'pending';
        }
        statusCell.innerText = results[i].reimbStatus.reimbStatusName;
        typeCell.innerText = results[i].reimbType.reimbTypeName;

        if(results[i].reimbStatus.reimbStatusName == 'pending') {
        
            approveCell.innerHTML = `<button id="approve-button${i}" class="btn btn-primary">Approve</button>`;
            denyCell.innerHTML = `<button id="deny-button${i}" class="btn btn-primary">Deny</button>`;
            document.getElementById(`approve-button${i}`).onclick = function() {
                    document.getElementById(`approve-button${i}`).disabled = true;
                    document.getElementById(`deny-button${i}`).disabled = true;
                    approveReimbursementRequest(
                    document.getElementById(`table-row${i}`), 
                    document.getElementById(`reimb-id-cell${i}`), 
                    document.getElementById(`amount-cell${i}`), 
                    document.getElementById(`submitted-cell${i}`), 
                    document.getElementById(`description-cell${i}`),
                    document.getElementById(`author-cell${i}`),
                    document.getElementById(`type-cell${i}`)
                );
            }
            document.getElementById(`deny-button${i}`).onclick = function() {
                document.getElementById(`approve-button${i}`).disabled = true;
                document.getElementById(`deny-button${i}`).disabled = true;
                denyReimbursementRequest(
                    document.getElementById(`table-row${i}`), 
                    document.getElementById(`reimb-id-cell${i}`), 
                    document.getElementById(`amount-cell${i}`), 
                    document.getElementById(`submitted-cell${i}`), 
                    document.getElementById(`description-cell${i}`),
                    document.getElementById(`author-cell${i}`),
                    document.getElementById(`type-cell${i}`)
                );
            }
        }
    }
}

//------------------------------------------------------------------------------------
//New Reimbursement component

async function loadReimbursement() {
    console.log('in loadReimbursement');
 
     APP_VIEW.innerHTML = await fetchView('reimbursement.view');
     DYNAMIC_CSS_LINK.href = 'css/reimbursement.css';
     configureReimbursement();
 }
 
 function configureReimbursement() {
     console.log('in configureReimbursement()');
 
     document.getElementById('alert-msg-reimbursement').hidden = true;
     document.getElementById('reimbursement-success').hidden = true;
     document.getElementById('reim-amount').addEventListener('blur', validateAmount);
     document.getElementById('reim-description').addEventListener('blur', validateDescription);
     document.getElementById('register-reimbursement').addEventListener('click', newReimbursement);
 
     document.getElementById('reim-description').disabled = true;
     document.getElementById('register-reimbursement').disabled = true;
 }
 
 
 function validateAmount(event) {
     if ((/^\s*-?\d+(\.\d{1,2})?\s*$/).test(event.target.value) && 1 < event.target.value.length && event.target.value.length < 8 ) {
         document.getElementById('reim-description').disabled = false;
     } else {
        document.getElementById('register-reimbursement').disabled = true;
     } 
 }
 
 function validateDescription(event) {
     if (10 < event.target.value.length && event.target.value.length < 250) {
         document.getElementById('register-reimbursement').disabled = false; 
     } else {
        document.getElementById('register-reimbursement').disabled = true;
     }
 }
 
 async function newReimbursement() {
     console.log('in newReimbursement()');
 
     let today = new Date();
     let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
     let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
     let dateTime = date+' '+time;

     let reimbTypeElement = document.getElementById('reim-type');
     let reimbursementType = reimbTypeElement.options[reimbTypeElement.selectedIndex].value;
     let reimbursementTypeId = 0;
     switch(reimbursementType){
         case "lodging":
         reimbursementTypeId = 1;
         break;
         case "travel":
         reimbursementTypeId = 2;
         break;
         case "food":
         reimbursementTypeId = 3;
         break;
         case "other":
         reimbursementTypeId = 4;
         break;
     }
 
     let newReim = {
         id: 0,
         amount: document.getElementById('reim-amount').value,
         submitted: dateTime,
         resolved: '',
         description: document.getElementById('reim-description').value,
         receipt: null,
         author: 0,
         resolver: 0,
         reimbStatus: 
         {
            reimbStatusId: '1',
            reimbStatusName: 'pending'
         },
         reimbType:
         {
            reimbTypeId: `${reimbursementTypeId}`,
            reimbTypeName: `${reimbursementType}`
         }

     };

     console.log(JSON.stringify(newReim));

     let response = await fetch('reimbursements', {
         method: 'POST',
         mode: 'cors',
         headers: {
            'Authorization' : localStorage.getItem('jwt')
         },
         body: JSON.stringify(newReim)
     });
 
     let responseBody = await response.json();
 
     if (responseBody != null) {
 
         document.getElementById('alert-msg-reimbursement').hidden = true;
         document.getElementById('reimbursement-success').hidden = false;
         setTimeout(getDashboard, 3000);
 
     } else {
         document.getElementById('alert-msg-reimbursement').hidden = false;
     }
 }


//Updating reimbursements
async function approveReimbursementRequest() {
    console.log('in approveReimbursementRequest()');

    

    document.getElementById(`table-row${i}`), 
    document.getElementById(`reimb-id-cell${i}`), 
    document.getElementById(`amount-cell${i}`), 
    document.getElementById(`submitted-cell${i}`), 
    document.getElementById(`description-cell${i}`),
    document.getElementById(`author-cell${i}`),
    document.getElementById(`type-cell${i}`)
    
    
}

function denyReimbursementRequest(row, reimbIdCell, amountCell, submittedCell, descriptionCell, authorCell, typeCell, approveCell, denyCell) {
    console.log('in denyReimbursementRequest()');
}

function viewByEmployee() {
    console.log('in viewByEmployee()')
}

//-------------------------------------------------------------------------------------
async function fetchView(uri) {
    let response = await fetch(uri, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Authorization': localStorage.getItem('jwt')
        }
    });

    if(response.status == 401) loadLogin();
    return await response.text();
}

//-------------------------------------------------------------------------------------

const APP_VIEW = document.getElementById('app-view');
const DYNAMIC_CSS_LINK = document.getElementById('dynamic-css');