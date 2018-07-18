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
    popUp.style.display = '';

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
            console.log(sessionStorage.getItem('login'));
            if(!sessionStorage.getItem('login')){
                alert("Nickname already taken");
            }else{
                popUp.style.display = 'none';

            }

            // userNameField.value = '';
            // nickNameField.value = '';

        } else {
            alert("Enter username and nickname");
        }
    };
}

function messageSend() {
    const messageInputField = document.getElementById('message-input-field');
    let date = new Date();

    let message = {
        'name': sessionStorage.getItem('userName'),
        'nick': sessionStorage.getItem('nickName'),
        'time': date.getHours() + ":" + date.getMinutes() + " " + date.getDay() + "." +
        date.getMonth() + "." + date.getDate(),
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
    let data = options.data || {};
    const xmlHttp = new XMLHttpRequest();

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(data));
    xmlHttp.onreadystatechange = function () {
        console.log(xmlHttp.status)
        if (xmlHttp.status === 403 && url === '/nickname') {
            alert("This nickname already taken, please, choose another");
            sessionStorage.setItem('login', 0);
            return 0;

        }

        if ( xmlHttp.status === 200 && url === '/nickname' && xmlHttp.readyState === 4){
            sessionStorage.setItem('login', 1);
            return 1;
        }
        if (xmlHttp.status === 200 && xmlHttp.readyState === 4) {
            callback(xmlHttp.responseText);
        }
        data={};
    };


}
;


function getData() {
    ajaxRequest({
        url: '/messages',
        method: 'GET',
        callback: function (message) {
            message = JSON.parse(message);
            const userNameField = document.getElementById('messages-container');
            userNameField.innerHTML = "";
            message.forEach((item, i) => {
                createMessageViews(item, i % 2);
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
            userList.forEach((item) => {
                createUsersList(item);
            })
        }
    })
}


function createMessageViews(message, i) {


    const userNameField = document.getElementById('messages-container');
    const contentWrapper = document.createElement('li');
    contentWrapper.setAttribute('class', i ? "left-side" : "right-side");

    const nicknameStart = message.text.indexOf("@") + 1;
    if (nicknameStart) {
        const search = message.text.substring(
            nicknameStart,
            message.text.indexOf(" ", nicknameStart)
        );
        if (sessionStorage.getItem('nickName') === search) {
            contentWrapper.setAttribute('class', 'private-message')
        }
    }


    const header = document.createElement('h5');
    const messageText = document.createElement('p');
    const timeDisplay = document.createElement('p');

    userNameField.appendChild(contentWrapper);
    contentWrapper.appendChild(header);
    contentWrapper.appendChild(timeDisplay);
    contentWrapper.appendChild(messageText);
    header.innerHTML = message.name + "(@" + message.nick + ")";

    messageText.innerHTML = message.text;
    timeDisplay.innerHTML = message.time;

    document.getElementsByClassName('messages-wrapper')[0].scrollTo(0, document.getElementsByClassName('messages-wrapper')[0].getBoundingClientRect().bottom);


}


function createUsersList(user) {
    const chatMatesList = document.getElementById("chatmates-list");

    const userWrapper = document.createElement('li');

    chatMatesList.appendChild(userWrapper);
    userWrapper.innerHTML = user.username + "(@" + user.nickname + ")";

}