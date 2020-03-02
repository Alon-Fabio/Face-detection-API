const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '3634fc260367403ca7e2a34a0b974b91'
});

const HandleClarifaiApi = (req, res)=> {
    app.models.initModel({id: Clarifai.FACE_DETECT_MODEL})
      .then(FACE_DETECT => {
        return FACE_DETECT.predict(req.body.input);
      })
      .then((ApiCallBack)=>res.json(ApiCallBack))
      .catch((err)=>{res.status(400).json(err)});
};

const HandleImage = (sqlDB)=>(req, res)=>{
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

//Trying to do buth in one fetch
const HandleImageAndApi = (sqlDB)=> (req,res) => {
    const {id,input}  = req.body;
    app.models.initModel({id: Clarifai.FACE_DETECT_MODEL})
      .then(FACE_DETECT => {
        return FACE_DETECT.predict(input);
      }).then((ApiRes)=>{
        console.log(id, ApiRes.outputs[0].data.regions);
        sqlDB('users')
        .where('id', '=', id)
        .increment(
            'entries', 1
        )
        .returning('entries')
        .then((entries)=>{return {entries:entries[0],ApiRes:ApiRes}})
        .then((ApiCallBack)=>{console.log("****" + ApiCallBack+"****");res.json(ApiCallBack[0])})

      })
      
}

module.exports = {
    HandleImage,
    HandleClarifaiApi,
    HandleImageAndApi
};