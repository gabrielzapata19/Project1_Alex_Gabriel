window.onload = function() {
    
    //yet to be implemented
    // document.getElementById('to-employee').addEventListener('click', loadEmployee);
    // document.getElementById('to-manager').addEventListener('click', loadManager);
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
    document.getElementById('alert-msg').hidden = true;
    document.getElementById('submit-creds').addEventListener('click', login);
    document.getElementById('register-button').addEventListener('click', loadRegister);
}

async function login() {
    console.log('in login()');
    let credentials = [];
    credentials.push(document.getElementById('username-cred').value);
    credentials.push(document.getElementById('password-cred').value);
    console.log(JSON.stringify(credentials));

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
        loadEmployee();
    } else {
        document.getElementById('alert-msg').hidden = false;
    }

}

//-------------------------------------------------------------------------------------

/*
    Register component

        - loadRegister()
        - configureRegister()
        - validateUsername()
        - validatePassword()
        - register()
*/

async function loadRegister() {
    console.log('in loadRegister()');
    APP_VIEW.innerHTML = await fetchView('register.view');
    DYNAMIC_CSS_LINK.href = 'css/register.css';
    configureRegister();
}

//finish implementing funciton for all
function configureRegister() {
    console.log('in configureRegister()');
    document.getElementById('register-username').addEventListener('blur', validateUsername);
    document.getElementById('register-password').addEventListener('blur', validatePassword);
    document.getElementById('register-first-name').addEventListener('blur', validateFirstName);
    document.getElementById('register-last-name').addEventListener('blur', validateLastName);
    document.getElementById('register-email').addEventListener('blur', validateEmail);
    document.getElementById('register-account').addEventListener('click', register);
}

function validateUsername(event) {
    console.log('in validateUsername');
    console.log(event.target.value);
}

function validatePassword(event) {
    console.log('in validatePassword');
    console.log(event.target.value);
}

function validateFirstName(event) {
    console.log('in validateFirstName');
    console.log(event.target.value);
}

function validateLastName(event) {
    console.log('in validateLastName');
    console.log(event.target.value);
}

function validateEmail(event) {
    console.log('in validateEmail');
    console.log(event.target.value);
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
    console.log(responseBody);
}

//-------------------------------------------------------------------------------------

/*
    Employee component
        - loadEmployee()
 */

async function loadEmployee() {
    console.log('in loadEmployee()');
    APP_VIEW.innerHTML = await fetchView('employee.view');
    DYNAMIC_CSS_LINK.href = 'css/employee.css';
    configureDashboard();
}

function configureEmployee() {
    console.log('in configureEmployee()');
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