const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const Register = require('../Controllers/Register');
const SignIn = require('../Controllers/SignIn');
const Image = require('../Controllers/Image');

const HandleRegister = Register.HandleRegister;
const HandleSignIn = SignIn.HandleSignIn;
const {HandleImage,HandleClarifaiApi,HandleImageAndApi} = Image;

const sqlDB = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'learning',
      database : 'facedetectiondb'
    }
  });

const mysalt = bcrypt.genSaltSync(10);

const app = express();


app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/profile/:id', (req, res)=>{
    const {id} = req.params;
    sqlDB.select('*').from('users').where({id: id})
    .then((user)=>{
        if (user.length){
            console.log(user[0])
        } else {(console.error('not found')
        )}
    }).catch((err)=>res.status(400).json(err));
});


app.post('/signin', HandleSignIn(sqlDB,bcrypt));

app.post('/register', HandleRegister(sqlDB,bcrypt,mysalt));

app.post('/imageApi', HandleImageAndApi(sqlDB));

app.listen(9000, ()=>{
    console.log("Working on port 9000");
});
