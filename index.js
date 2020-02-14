const express = require('express');
const App = express();
const bodyparser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session')


const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
  });;

db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("mysql is connected");
        
    }
})




App.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))


App.use(bodyparser.urlencoded({extended:false}))
App.use(bodyparser.json())

App.set('view engine', 'ejs');

const port= process.env.PORT || 3000
App.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})



// App.get('/',(req,res)=>{
//     const prams={
//         name: req.query.name,
//         age: req.query.age,
//     }  
//     res.render('index')
// })

App.get('/', function(req, res) {
    db.query("select * from posts",(err,data)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            const postsList = data;
            res.render('pages/index', {postsList, title:"Home",
                                                  indexActive: "active"});
        }
        
    })
})



App.get('/addpost', function(req, res) {
    const pageData ={
        title:"About",
        postActive: "active"
    }
    res.render('pages/addpost',pageData);
})

App.post('/addpost',(req,res)=>{
    postName = req.body.postTitle
    postDesc = req.body.postDesc
    db.query(`insert into posts values (null,'${postName}','${postDesc}')`,(err,data)=>{
        if(err)
        {
            console.log(postName + "   " + postDesc);
            console.log(err);
        }
        else{
            res.redirect('/')
        }
    })    
})


App.get("/postDelete/:id",(req,res)=>{
    if(req.params.id){
        const id = req.params.id;
        db.query(`delete from posts where id = ${id}`,(err)=>{
            if(err)
            {
                console.log(err);
            }
            else{
                res.redirect('/');
            }
        })    
    }
    else{
        res.send("please enter the id of post you want to delete")
    }
    
})