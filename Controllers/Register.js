const HandleRegister = (sqlDB,bcrypt,mysalt)=>(req, res)=>{
    console.log("Register in trigered");

    if (!req.body.email||!req.body.name||!req.body.password){
        return res.status(400).json("Bad request");
    }
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
        
    })}

    module.exports = {
        HandleRegister: HandleRegister
    };