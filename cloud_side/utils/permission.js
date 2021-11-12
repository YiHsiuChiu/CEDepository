let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/CarData"

let db = null;

MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, async (err,client) => {
    if (err) {
        console.log(err);
    }
    db = await client.db('CarData');
    db = db.collection('user')
    console.log('Database connected: User');
});


const admin_roles_check = async (req, res, next) => {
    let token = req.get('X-Token')
    let result = await db.findOne({token: token },{projection:{ roles: 1 }});
    if (result.roles.includes('admin')) next();
    else{
        return res.status(200).json({code:40001,message: 'No Permission!'})
    }
}


module.exports = {
    admin_roles_check,
}