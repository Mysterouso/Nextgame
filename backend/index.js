const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')
const bcrypt = require('bcrypt');
const db = require('./db')
const session = require ('express-session')
const pgSession = require('connect-pg-simple')(session)
const helmet = require('helmet');
const morgan = require('morgan');

const commentRouter = require('./Routes/Comments')

const signin = require('./Routefunctions/signin')
const register = require('./Routefunctions/register')

const { fields, url } = require('./Constants/API');
const corsOptions= require('./Constants/Corsconfig');
const sessionConfig = require('./Constants/Sessionconfig');


const app = express()

//Middlewares
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(session({ 
  store: new pgSession({pool:db.pool}),
  ...sessionConfig
}))
app.use(morgan('combined'));

// Routes
app.use('/comments',commentRouter);

app.post('/',(req,res)=>{

  let body;

  if(req.body.search) body = (`search "${req.body.search}"; fields ${fields} limit 25;`);
  else if(req.body.slug) body= `fields ${fields} where slug = "${req.body.slug}";`;

  fetch(url,{
    method:'POST',
    body,
    headers: {
      'user-key': process.env.REACT_APP_API_KEY
    }
  })
  .then(resp=>resp.json())
  .then(response=>res.json(response))
  .catch(err=>res.status(400).json(err))
})

app.post('/signin',(req,res)=>signin(db,bcrypt,req,res))

app.post('/register',(req,res)=>register(db,bcrypt,req,res))

app.get('/session',(req,res)=>{
  
  if( !req.session.user || !Object.keys(req.session.user).length ) return res.json({isLoggedIn:false});
  
  const findEmailQuery = "SELECT * FROM user_details WHERE id = $1;";

  db.makeQuery([req.session.user.id],findEmailQuery)
  .then(item=>{ 
      res.json({
        isLoggedIn:true,
        user:{
          id:item[0].id, 
          name:item[0].name, 
          email:item[0].email
        }
      });
  })
  
})

app.get('/logout',(req,res)=>{
  
  req.session.destroy((err)=>{
    if(err){
      console.log(err);
      return res.json({loggedOut:false});
    }
    res.json({loggedOut:true})
  })

})


  
app.listen(5000,()=>console.log('Listening on port 5000'))












