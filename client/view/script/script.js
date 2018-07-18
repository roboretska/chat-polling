(function () {

        const chatMatesList = document.getElementById("chatmates-list");
        const messageInputButton = document.getElementById('message-input-button');




        NameEnter();

        messageInputButton.onclick=function () {
            messageSend();
        };

        setInterval(function (){
            AJAXGetMessage();
        }, 1000);
}());


function NameEnter() {

    const popUp = document.getElementById('pop-up');

    const userNameField = document.getElementById('username-field');
    const nickNameField = document.getElementById('nickname-field');
    const popUpButton = document.getElementById('nickname-submit');


    popUpButton.onclick=function () {
        if(userNameField.value!=='' && nickNameField.value!=='') {
            sessionStorage.setItem('userName', userNameField.value);
            sessionStorage.setItem('nickName', nickNameField.value);
            popUp.style.display = 'none';
        }else {
            alert("Enter username and nickname");
        }
    };
}

function messageSend(){
    const messageInputField = document.getElementById('message-input-field');


    console.log('im working');
        let message = {
            'name': sessionStorage.getItem('userName'),
            'nick': sessionStorage.getItem('nickName'),
            'time': new Date(),
            'text': messageInputField.value
        };

    AJAXPostMessage(message);
        messageInputField.value="";

}

function AJAXPostMessage(message){
    const url = "/messages";
    const method = "POST";
    const xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open(method, url, true);
    xmlHTTP.setRequestHeader("Content-type", "application/json");
    xmlHTTP.send(JSON.stringify(message));

}

function AJAXGetMessage(){
    const url = "/messages";
    const method = "GET";
    const xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open(method, url, true);
    xmlHTTP.send();
    xmlHTTP.onreadystatechange = function () {
        if (xmlHTTP.status===200 && xmlHTTP.readyState===4){
            getMessages(JSON.parse(xmlHTTP.responseText));
        }
    }
}

function getMessages(messages) {

    console.log(messages);
    const userNameField = document.getElementById('messages-container');
    const messagesAmount= userNameField.getElementsByTagName('div').length;
    sessionStorage.setItem("messagesAmount", messagesAmount);


    if(messages.length > messagesAmount){
        for(let i=sessionStorage.getItem('messagesAmount'); i<=messages.length; i++){
            console.log(messages);
            console.log(messages.length);

            console.log(sessionStorage.getItem('messagesAmount'));
            console.log(messages.length);
            createMessageViews(messages[i]);
        }
    }

}

function createMessageViews(message){

    console.log(message);

    const userNameField = document.getElementById('messages-container');


    const contentWrapper = document.createElement('li');

    const messageWrapper = document.createElement('div');

    const header = document.createElement('h5');
    const messageText = document.createElement('p');
    const timeDisplay = document.createElement('p');

    userNameField.appendChild(contentWrapper);
    contentWrapper.appendChild(messageWrapper);
    messageWrapper.appendChild(header);
    messageWrapper.appendChild(messageText);
    messageWrapper.appendChild(timeDisplay);

    header.innerHTML=message.name+"(@"+message.nick+")";
    messageText.innerHTML=message.text;
    timeDisplay.innerHTML=message.time;

}