const express = require('express');
const App = express();
const bodyparser = require('body-parser');
const session = require('express-session')
const db = require('./prod-config');


db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("postgres database is connected");
        
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



App.get('/', function(req, res) {
    db.query("select * from posts",(err,data)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            const postsLists = data.rows;            
            res.render('pages/index', {postsLists, title:"Home",
                                                  indexActive: "active"});
        }
        
    })
})

App.post('/',(req,res)=>{
    db.query("select * from posts",(err,data)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            const postsLists = data.rows;            
        
    db.query(`select * from posts where id = '${req.body.editid}'`,(err2,data2)=>{
        if(err2)
        {
            console.log(err2);
        }
        else{
            
            const postsList = data2.rows;
            res.render('pages/index', {postsLists,postsList, title:"Home",
                                    indexActive: "active",
                                    "editable":true });
        }

    })
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
    db.query(`insert into posts(title,"desc") values ('${postName}','${postDesc}')`,(err,data)=>{
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