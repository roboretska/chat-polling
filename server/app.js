const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const messages=[];
const MAX_AMOUNT=99;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("../client/view"));

app.get('/messages', (req,res)=>{
    res.json(messages);
});

app.post('/messages', (req,res)=>{
    if(messages.length>=99){
        messages.shift();
    }

    messages.push(req.body);
    console.log(messages);

});

const server = app.listen(8000, ()=>{
    console.log('Server is working now on port 8000')
});

