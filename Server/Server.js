const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');


const app = express();

const database = [
    {
        id:"55",
        name:"Alon",
        email:"alon@alon.com",
        password:"appels",
        enteries: 0,
        juined: new Date()
    },
    {
        id:"80",
        name:"Katy",
        email:"Katy@Katy.com",
        password:"bananes",
        enteries: 0,
        juined: new Date()
    },

]

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.get('/', (req, res)=>{
    res.send(database)
});
app.post('/signin', (req, res)=>{
    if(req.body.password === database[0].password && req.body.email === database[0].email){
        res.json("sucsses")
    } else {res.status(400).json("err login in")}
});
app.post('/register', (req, res)=>{
    console.log(req.body);
    res.send(database[0]);
});

app.listen(9000, ()=>{
    console.log("Working on port 9000");
});