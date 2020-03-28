const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: //Insert APIkey
});

//Trying to do buth in one fetch
const HandleImageAndApi = (sqlDB)=>(req,res) => {
  app.models.initModel({id: Clarifai.FACE_DETECT_MODEL})
  .then(FACE_DETECT => {
    return FACE_DETECT.predict(req.body.input);
  })
  .then((ApiCallBack)=>{
    const id  = req.body.id;
    console.log(id);
    sqlDB('users')
    .where('id', '=', id)
    .increment(
        'entries', 1
    )
    .returning('entries')
    .then((entries)=>{res.json({entries:entries[0],APIres:ApiCallBack})})
    .catch((err)=>{res.status(400).json(err)})
  })
  .catch((err)=>{res.status(400).json(err)});
  
}

module.exports = {
    HandleImageAndApi
};