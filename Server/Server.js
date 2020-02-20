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
// sqlDB.insert({name: 'alon', email: 'alon@test.com', entries: '2', joined: new Date()}).into('users')
// .then((data)=>{console.log(data)});




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
    if(req.body.password === database.users[0].password && req.body.email === database.users[0].email){
        res.json("sucsses")
    } else {res.status(400).json("err login in")}
});


app.post('/register', (req, res)=>{

    let hash = bcrypt.hashSync(req.body.password, 10);
    sqlDB.transaction((trx)=>{
        trx.insert({hash: hash, email: req.body.email}).into('login')
        .returning('email')
        .then((LoginEmail)=>{
            return trx.insert({name: req.body.name, email: LoginEmail[0], joined: new Date()})
            .into('users').returning('*')
            .then((user)=>res.json(user[0]));
        })
        .then(trx.commit)
        .then(trx.rollback);
    }).catch(err => res.status(400).json(err));
    // sqlDB.insert({hash: hash, email: req.body.email}).into('login')
    // .returning('email')
    // .then((LoginEmail)=>{
    //     sqlDB.insert({name: req.body.name, email: LoginEmail[0], joined: new Date()})
    //     .into('users').returning('*')
    //     .then((user)=>res.json(user[0]));
    // }).catch(err => res.status(400).json(err));
    

    
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