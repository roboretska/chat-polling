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
    users.forEach(item=>{
        if(item.username===req.body.username){
            res.status(404).send("Nickname is already taken");
            res.end();
        }
    });
    users.push(req.body);
});


const server = app.listen(8000, ()=>{
    console.log('Server is working now on port 8000')
});

