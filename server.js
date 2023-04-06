
/*Name: Yazid Boufous
This is the server file for PA10 of CSC337. It supports a number of different kind of requests and responds accordingly.*/

const express = require('express');
const mongoose= require('mongoose');
const parser = require('body-parser');
const fs = require('fs');
const cookieParser= require('cookie-parser');


const connection_string = 'mongodb://127.0.0.1:27017';

mongoose.connect(connection_string, { useNewUrlParser: true });
mongoose.connection.on('error', () => {
  console.log('There was a problem connecting to mongoDB');
});

//Defining Schema for Item 
var itemSchema = new mongoose.Schema( {
    title: String,
    description: String,
    image: String,
    price: Number,
    stat: String
});
var item = mongoose.model('Item', itemSchema);

//Defining Schema for Schema
var userSchema = new mongoose.Schema( {
    username: String,
    password: String,
    listings: [],
    purchases: []
});

var user = mongoose.model('User', userSchema);


let sessions={};

function addSession(user){
    let sessionId= Math.floor(Math.random() * 100000);
    let sessionStart= Date.now();
    sessions[user]={'sid':sessionId, 'start':sessionStart};
    return sessionId;
}

function doesUserHaveSession(user, sessionId){
    let entry= sessions[user];
    if (entry!= undefined){
        return entry.sid=sessionId;
    }
    else{
        return false;
    }
}


const SESSION_LENGTH=60000;


function cleanupSessions(){

    let currentTime=Date.now();
    for (i in sessions){

        let sess=sessions[i];
        if (sess.start + SESSION_LENGTH < currentTime){
                delete sessions[i];
        }
        else{
        }
    }
}


setInterval(cleanupSessions, 2000);

function authenticate (req,res,next){

    let c = req.cookies;
    if (c && c.login) {
      let result = doesUserHaveSession(c.login.username, c.login.sid);
      if(result) {
        next();
        return;
    }

    res.redirect("/index.html");
    }
    

}

const app = express();
app.use(cookieParser());
app.use('/home.html', authenticate);
app.use('/post.html', authenticate);
app.use(express.static('public_html'));
app.use(express.json());


//route creating user
app.post('/create/account',(req, res) => {

    let p1= user.find({username: req.body.username}) .exec();
    
    p1.then( (results) => { 

        if(results.length==0){
            var newUser = new user(req.body);
            newUser.save();
            res.send("Created");
        }

        else{
            res.send("Username already exists");
        }
        
    });

    p1.catch( (err) => { 
        console.log(err);
        res.send('Account failed');
    });
    
});


app.post('/log/user',(req, res) => {

    var newUser = new user(req.body);

    let u=req.body.username;
    let p=req.body.password;

    let p1 = user.find( {username: u, password:p} ).exec();

    p1.then( (results) => { 
        if (results.length >0){
            let sesID= addSession(u);
            res.cookie("login", {username:u , sid: sesID}, {maxAge: 30000});
            res.send('login '+u);
        }
        else{
            res.send('login failed');
        }
    });

    p1.catch( (err) => { 
        console.log(err);
        res.send('FAILED TO CREATE A USER');
    });
    
});


app.post('/create/post', (req,res)=>{

    var newItem = new item(req.body);
    let p1 = newItem.save();


    let u=req.cookies.login.username;

    p1.then( (doc) => { 
        
      if (req.body.stat.toLowerCase()=='sale'){

        user.findOneAndUpdate({ username:u }, { $push: { listings: newItem._id } })
        .then( response => {
          console.log('added successfully');
        })
        .catch(err => {
          console.log(err);
        });
    }

    else{
        user.findOneAndUpdate({ username:u }, { $push: { purchases: newItem._id } })
        .then( response => {
          console.log('added successfully');
        })
        .catch(err => {
          console.log(err);
        });
    }
    });


    p1.catch( (err) => { 
        console.log(err);
        res.send("FAILED TO CREATE AN ITEM");
    });

        
});



app.get("/get/listings", (req,res)=>{


    let p1= user.find(
        { username: req.cookies.login.username}
    )
    .exec();


    p1.then((results)=>{

        let itemsID= results[0].listings;

        var items=[];
        let promises = [];

        for (let i = 0; i < itemsID.length; i++) {
            let p2 = item.findOne({ _id: itemsID[i] }).exec();
            promises.push(p2);
        }

        Promise.all(promises).then((data) => {
            for (let i = 0; i < data.length; i++) {
                items.push(data[i]);
            }
            res.send(JSON.stringify(items));
            
        })

    })
    .catch((err)=>{
        console.log("something went wrong",err);
    });

});



app.get("/get/purchases", (req,res)=>{

    let p1= user.find(
        { username: req.cookies.login.username}
    )
    .exec();

    p1.then((results)=>{

        var itemsID= results[0].purchases;

        var items=[];
        var promises = [];

        for (var i = 0; i < itemsID.length; i++) {
            var p2 = item.findOne({ _id: itemsID[i] }).exec();
            promises.push(p2);
        }

        Promise.all(promises).then((data) => {
            for (var i = 0; i < data.length; i++) {
                items.push(data[i]);
            }
            res.send(JSON.stringify(items));
            
        })

    })
    .catch((err)=>{
        console.log("something went wrong",err);
    })
});


app.get("/search/items/:KEYWORD", (req,res)=>{

    let p1=item.find(
        { description: { $regex: req.params.KEYWORD}}
    ).exec();


    p1.then( (results) => { 
        res.send( JSON.stringify(results) );
    })

    .catch( (error) => {
        console.log(error);
        res.send('FAIL');
    });  

});
 


app.post( "/add/purchase", (req, res)=> {

    let id=req.body._id;

    user.findOneAndUpdate({ username:req.cookies.login.username }, { $push: { purchases: id} })
    .then( () => {

        p2=item.findOneAndUpdate({ _id: id}, { $set: { stat: "sold"} })
        .then(()=>{
            console.log("stat changed");
        })
        .catch(()=>{
            console.log("could not change",err);
        })

        res.redirect("/home.html");

    })
    .catch(err => {
      console.log(err);
    });


});


app.listen(3000, () => {
    console.log('server has started');
  });
    
