const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')

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


app.post('/signin', (req, res)=>{
    console.log("Sing in trigered");

    sqlDB.select('email', 'hash').from('login').where('email', '=', req.body.email)
    .then((LoginPass)=> {
        bcrypt.compare(req.body.password, LoginPass[0].hash)
        .then((passCheck)=>{
        if (passCheck){
            sqlDB.select('*').from('users').where('email', '=', req.body.email)
            .then(user=>{console.log(user); res.json(user[0])})
            .catch((err) => {
                console.log(err);
                return res.status(400).json({error:'Unabel to register'})});
        } else {
            res.json({error:"No match"});
        }})})
        .catch((err) => {
            console.log('General err trigered');
            return res.status(400).json({error:'Unabel to register'})});
});


app.post('/register', (req, res)=>{

    console.log("Register in trigered");

    let hash = bcrypt.hashSync(req.body.password, mysalt);
    sqlDB.transaction((trx)=>{
        trx.insert({hash: hash, email: req.body.email}).into('login')
        .returning('email')
        .then((LoginEmail)=>{
            return trx.insert({name: req.body.name, email: LoginEmail[0], joined: new Date()})
            .into('users').returning('*')
            .then((user)=>res.json(user[0]))
            .catch((err) => {
                console.log('User err trigered');
                return res.status(400).json('Unabel to register')});
        })
        .then(trx.commit)
        .then(trx.rollback).catch((err) => {
            console.log('General err trigered');
            return res.status(400).json('Unabel to register')});
        
    })
});

app.post('/image',(req, res)=>{
    const id  = req.body.id;
    console.log(id);
    sqlDB('users')
    .where('id', '=', id)
    .increment(
        'entries', 1
    )
    .returning('entries')
    .then((entries)=>{res.json(entries[0])})
    .catch((err)=>{res.status(400).json(err)});

})

app.listen(9000, ()=>{
    console.log("Working on port 9000");
});

// setTimeout(()=>{
//     sqlDB.select('*').from('users').then((data)=>{console.log(data)});
//     sqlDB.select('*').from('login').then((data)=>{console.log(data)});
// }, [2000]);