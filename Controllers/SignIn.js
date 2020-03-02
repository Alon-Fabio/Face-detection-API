const HandleSignIn = (sqlDB,bcrypt) =>(req, res)=>{
    console.log("Sing in trigered");

    const {email,password} = req.body;

    if (!email||!password){
        return res.status(400).json("Bad request");
    }

    sqlDB.select('email', 'hash').from('login').where('email', '=', email)
    .then((LoginPass)=> {
        bcrypt.compare(password, LoginPass[0].hash)
        .then((passCheck)=>{
        if (passCheck){
            sqlDB.select('*').from('users').where('email', '=', email)
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
}

module.exports = {
    HandleSignIn
};