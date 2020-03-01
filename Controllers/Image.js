const HandleSignIn = (sqlDB)=>(req, res)=>{
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
};

module.exports = {
    HandleSignIn:HandleSignIn
};