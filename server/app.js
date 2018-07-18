const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const messages=[];
const users=[];

const MAX_AMOUNT=100;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("../client/view"));

app.get('/messages', (req,res)=>{
    res.json(messages);
});

app.post('/messages', (req,res)=>{
    if(messages.length>=MAX_AMOUNT){
        messages.shift();
    }

    messages.push(req.body);
    console.log(messages);

});

app.get('/nickname', (req,res)=>{
    res.json(users);
});
app.post('/nickname',(req,res)=>{
    let flag = 0;
    users.forEach(item=>{
        if(item.nickname===req.body.nickname){
            console.log(item.nickname);
            console.log(req.body.nickname);
            res.status(403).send("Nickname is already taken");
            res.end();
            flag =1;
            console.log('loosers')
        }

    });
    console.log(req.body.nickname);
    console.log(users);
    console.log(flag);


    if(!flag)users.push(req.body);

});


const server = app.listen(8000, ()=>{
    console.log('Server is working now on port 8000')
});

