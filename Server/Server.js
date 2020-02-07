const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');


const app = express();

const database ={ 
        users:[
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

    ],secrets:[
        {

        }
    ]
}

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.get('/', (req, res)=>{
    res.send(database)
});
app.post('/signin', (req, res)=>{
    if(req.body.password === database.users[0].password && req.body.email === database.users[0].email){
        res.json("sucsses")
    } else {res.status(400).json("err login in")}
});
app.post('/register', (req, res)=>{
    console.log(req.body);
    res.send(database.users[0]);
});

app.post('/image',(req, res)=>{
    // const id  = req.body.id;
    // let found = false;
    // console.log(req.body + " Image req")
    // database.users.forEach(user=>{
    //     if(user.id===id){
    //         found=true;
    //         user.enteries++;
    //         console.log(user.enteries)
    //         return res.json(user.enteries)
    //     }
    // })
    console.log(req.body + " Image req")
    res.send(database.users[0]);
    // if (!found) {
    //     res.status(400).json('not found');
    // }
    
})

app.listen(9000, ()=>{
    console.log("Working on port 9000");
});