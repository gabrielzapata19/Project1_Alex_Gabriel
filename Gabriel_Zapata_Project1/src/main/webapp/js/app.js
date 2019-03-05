window.onload = function() {
    document.getElementById('to-login').addEventListener('click', loadLogin);
    document.getElementById('to-logout').addEventListener('click', logout);
    //yet to be implemented
    document.getElementById('to-employee').addEventListener('click', loademployee);
    document.getElementById('to-manager').addEventListener('click', loadManager);
    
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

        let user = await response.json();
        console.log(user);
        
    } else {
        document.getElementById('alert-msg').hidden = false;
    }

}


//-------------------------------------------------------------------------------------

function fetchView(uri) {
    let responsePromise = fetch(uri);
    
    let responseBodyPromise = responsePromise.then(resp => {
        if(resp.status == 401) loadLogin();
        return resp.text();
    });

    let data = responseBodyPromise.then(dataText => dataText);
    return data;

}

//-------------------------------------------------------------------------------------

const APP_VIEW = document.getElementById('app-view');
const DYNAMIC_CSS_LINK = document.getElementById('dynamic-css');