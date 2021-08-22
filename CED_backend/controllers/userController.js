let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/CarData"

let crypto = require('crypto');

let db = null;

MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, async (err,client) => {
    if (err) {
        console.log(err);
    }
    db = await client.db('CarData');
    db = db.collection('user')
    console.log('Database connected: CarData');
});



const tokens = {
    admin: {
        token: 'admin-token'
    },
    editor: {
        token: 'editor-token'
    }
}

const users = {
    'admin-token': {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    },
    'editor-token': {
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
}

const login = async (req,res) =>{
    const { username , password } = req.body

    let result = await db.findOne({username: username },{projection:{ _id:0, 'password': 1 }});
    console.log(result)

    let hashPWD = crypto.createHash('md5').update(password).digest("hex");

    // const token = tokens[username]
    let token = undefined

    if(result.password === hashPWD){
        token = crypto.createHash('md5').update(username+Math.floor(Date.now()/ 1000)).digest("hex");
        await db.updateOne({'username':username},{$set:{'token':token}})
    }
    // mock error
    if (!token) {
        return res.status(200).json({code:60204,message: 'Account and password are incorrect.'})
        // return {
        //     code: 60204,
        //     message: 'Account and password are incorrect.'
        // }
    }

    return res.status(200).json({code:20000,data:{token:token}})
}

const info = async (req,res) =>{
    const { token } = req.query

    let result = await db.findOne({token: token },{projection:{ username: 0, password: 0, _id: 0, id: 0 }});

    let info = users[token]

    info = result

    // mock error
    if (!info) {
        return res.status(200).json({code:50008,message: 'Login failed, unable to get user details.'})
        // return {
        //     code: 50008,
        //     message: 'Login failed, unable to get user details.'
        // }
    }

    return res.status(200).json({code:20000,data:info})
}

const register = async (req,res) =>{
    const { username , password } = req.body

    let latest = await db.find({}).sort({id:-1}).limit(1).toArray()
    let latestID = (latest.length > 0)? latest[0].id + 1 : 1

    let hashPWD = crypto.createHash('md5').update(password).digest("hex");
    let result = await db.insertOne({
        id: latestID,
        username: username,
        password: hashPWD,
        roles: ['user'],
        introduction: 'I am an user',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal User',
        token: ''
    })
    if (result.insertedId !== undefined) return res.status(200).json({code: 20000, data: 'success',id: latestID})
}

const logout = async (req,res) => {
    let token = req.get('X-Token')
    await db.updateOne({token: token},{$set:{'token':''}})
    res.status(200).json({code: 20000, data: 'success'})
}

async function getUserData(query) {
    // Connect to the db
    let data;
    let result = await db.find({},{projection:{ password: 0, _id: 0 }}).toArray();
    data = result;

    // console.log(data)
    // fs.writeFile('user.json', JSON.stringify(data), (err) => {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log("JSON data is saved.");
    // });
    return JSON.stringify(data);
}

const getList = async (req,res) => {
    let tokenData = await getUserData(req.query);

    const { id,username, page = 1, limit = 20, sort } = req.query
    
    let dataAfterFilter = JSON.parse(tokenData).filter(item => {
       
        if (id && item.id.toString().indexOf(id) < 0) return false
        if (username && item.owner.indexOf(username) < 0) return false
        return true
    })

    if (sort === '-id') {
        dataAfterFilter = dataAfterFilter.reverse()
    }

    const pageList = dataAfterFilter.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    let data = {total: dataAfterFilter.length,items:pageList}

    return res.status(200).json({code:20000,data:data})
}

const createUser = async (req,res) => {
    let {username,password,roles,name,introduction,avatar,token} = req.body
    let hashPWD = crypto.createHash('md5').update(password).digest("hex");
    let latest = await db.find({}).sort({id:-1}).limit(1).toArray()
    let latestID = (latest.length > 0)? Number(latest[0].id) + 1 : 1
    let result = await db.insertOne(
        {'id': latestID,
            'username': username,
            password: hashPWD,
            'roles': roles.split(','),
            'name': name,
            introduction: introduction,
            avatar: avatar,
            token: token})
    if (result.insertedId !== undefined) return res.status(200).json({code: 20000, data: 'success',id: latestID})

    return res.status(200).json({code:40000,message: "Create fail! can't not create this token"})
}

const updateUser = async (req,res) => {
    let {username,password,roles,name,introduction,avatar,token} = req.body
    let hashPWD = crypto.createHash('md5').update(password).digest("hex");

    let result = await db.updateOne({'username': username},{$set:
        {   'username': username,
            password: hashPWD,
            'roles': roles.split(','),
            'name': name,
            introduction: introduction,
            avatar: avatar,
            token: token}})
    return res.status(200).json({code:20000,data:'success'})
}

const deleteUser = async (req,res) => {
    let {username} = req.body
    await db.deleteOne({'username': username})
    return res.status(200).json({code:20000,data:'success'})
}


module.exports = {
    login,
    info,
    register,
    logout,
    getList,
    createUser,
    updateUser,
    deleteUser,
}
