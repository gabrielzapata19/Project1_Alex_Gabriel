
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

function loadReimbursement() {
	console.log('in loadReimbursement');
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
    document.getElementById('view-all').addEventListener('click', loadManager);
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
        let reimbIdCell = document.createElement('td');
        let firstNameCell = document.createElement('td');
        let lastNameCell = document.createElement('td');
        let amountCell = document.createElement('td');
        let submittedCell = document.createElement('td');
        let resolvedCell = document.createElement('td');
        let descriptionCell = document.createElement('td');
        let authorCell = document.createElement('td');
        let resolverCell = document.createElement('td');
        let statusCell = document.createElement('td');
        let typeCell = document.createElement('td');
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
            document.getElementById(`approve-button${i}`).addEventListener('click', approveReimbursementRequest);
            document.getElementById(`deny-button${i}`).addEventListener('click', denyReimbursementRequest);
        }
    }
}

function approveReimbursementRequest() {
    console.log('in approveReimbursementRequest()');
}

function denyReimbursementRequest() {
    console.log('in denyReimbursementRequest()');
}

function viewByEmployee() {
    console.log('in viewByEmployee()')
}

function loadReimbursement() {
	console.log('in loadReimbursement()');
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