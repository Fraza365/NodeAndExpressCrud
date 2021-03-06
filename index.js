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

        const q = `select * from posts where id NOT IN (${req.body.editid})`;
    
    db.query(q,(err,data)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            const postsLists = data.rows;            
            const query = {
                text: "select * from posts where id = $1",
                values : [req.body.editid]
            }
    db.query(query,(err2,data2)=>{
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
    const postName = req.body.postTitle;
    const postDesc = req.body.postDesc;
    
    const query= {text:`insert into posts(title,"desc") values($1 ,$2 )`,
                  values: [postName,postDesc] 
                 }
    db.query(query,(err,data)=>{
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
        const query= {text:`delete from posts where id = $1`,
                  values: [id] 
                 }
        db.query(query,(err)=>{
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

App.post('/updatepost',(req,res)=>{
    const postTitle= req.body.posttitle;
    const postDesc= req.body.postdesc;
    const id = req.body.editid;
    const query= {text:`update posts set title = $1, "desc" = $2 where id = $3`,
                  values: [postTitle,postDesc,id] 
                 }
    db.query(query,(err,data)=>{
        if(err) console.log(err);
        
        else{
            res.redirect('/');
        }
    })
    
})