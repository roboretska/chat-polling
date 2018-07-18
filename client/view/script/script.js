(function () {

    const chatMatesList = document.getElementById("chatmates-list");
    const messageInputButton = document.getElementById('message-input-button');


    NameEnter();

    messageInputButton.onclick = function () {
        messageSend();
    };

    setInterval(function () {
        getData();
    }, 1000);
}());


function NameEnter() {

    const popUp = document.getElementById('pop-up');

    const userNameField = document.getElementById('username-field');
    const nickNameField = document.getElementById('nickname-field');
    const popUpButton = document.getElementById('nickname-submit');


    popUpButton.onclick = function () {
        if (userNameField.value !== '' && nickNameField.value !== '') {
            sessionStorage.setItem('userName', userNameField.value);
            sessionStorage.setItem('nickName', nickNameField.value);
            ajaxRequest({
                'method': 'POST',
                'url': '/nickname',
                'data': {
                    'username': userNameField.value,
                    'nickname': nickNameField.value
                }
            });
            popUp.style.display = 'none';

        } else {
            alert("Enter username and nickname");
        }
    };
}

function messageSend() {
    const messageInputField = document.getElementById('message-input-field');


    console.log('im working');
    let message = {
        'name': sessionStorage.getItem('userName'),
        'nick': sessionStorage.getItem('nickName'),
        'time': new Date(),
        'text': messageInputField.value
    };
    ajaxRequest({
        'method': 'POST',
        'url': '/messages',
        'data': message
    });
    messageInputField.value = "";

}

function ajaxRequest(options) {
    const url = options.url || '/';
    const method = options.method || 'GET';
    const callback = options.callback || function () {
    };
    const data = options.data || {};
    const xmlHttp = new XMLHttpRequest();

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(data));
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.status === 200 && xmlHttp.readyState === 4) {
            callback(xmlHttp.responseText);
        } else if (xmlHttp.status === 403) errorHandler(xmlHttp.responseText);
    };

};


function getData() {
    ajaxRequest({
        url: '/messages',
        method: 'GET',
        callback: function (message) {
            message = JSON.parse(message);
            const userNameField = document.getElementById('messages-container');
            userNameField.innerHTML = "";
            message.forEach(item => {
                createMessageViews(item);
            })
        }
    });
    ajaxRequest({
        url: '/nickname',
        method: 'GET',
        callback: function (userList) {
            userList = JSON.parse(userList);
            const chatMatesList = document.getElementById("chatmates-list");
            chatMatesList.innerHTML = "";
            userList.forEach((item, i) => {
                createUsersList(item, i%2);
            })
        }
    })
}


function createMessageViews(message, i) {


    const userNameField = document.getElementById('messages-container');
    const contentWrapper = document.createElement('li');

    const messageWrapper = document.createElement('div');

    const header = document.createElement('h5');
    const messageText = document.createElement('p');
    const timeDisplay = document.createElement('p');

    userNameField.appendChild(contentWrapper);
    contentWrapper.appendChild(messageWrapper);
    messageWrapper.appendChild(header);
    messageWrapper.appendChild(timeDisplay);
    messageWrapper.appendChild(messageText);
    header.innerHTML = message.name + "(@" + message.nick + ")";
    messageText.innerHTML = message.text;
    timeDisplay.innerHTML = message.time;

}

function createUsersList(user) {
    const chatMatesList = document.getElementById("chatmates-list");

    const userWrapper = document.createElement('li');

    chatMatesList.appendChild(userWrapper);
    console.log(user);
    userWrapper.innerHTML=user.username + "(@" + user.nickname + ")";

}