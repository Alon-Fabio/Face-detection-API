const HandleRegister = (sqlDB,bcrypt,mysalt)=>(req, res)=>{
    console.log("Register in trigered");
    const {email, name, password} = req.body
    if (!email||!name||!password){
        return res.status(400).json("Bad request");
    }
    let hash = bcrypt.hashSync(password, mysalt);
    sqlDB.transaction((trx)=>{
        trx.insert({hash: hash, email: email}).into('login')
        .returning('email')
        .then((LoginEmail)=>{
            return trx.insert({name: name, email: LoginEmail[0], joined: new Date()})
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
        HandleRegister
    };