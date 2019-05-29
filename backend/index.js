const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')
const bcrypt = require('bcrypt');
const db = require('./db')
const jwt = require('jsonwebtoken')
const session = require ('express-session')
const pgSession = require('connect-pg-simple')(session)
const commentRouter = require('./Routes/Comments')


var whitelist = ['http://localhost:3000']
var corsOptions = {
  credentials:true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const saltRounds = 10;


const app = express()

//Middlewares
app.use(cors(corsOptions))
// app.use(express.urlencoded({extended:false}))
app.use(express.json())

/
app.use(session({
  store: new pgSession({
   pool:db.pool
  }),
  secret: process.env.REACT_JWT_TOKEN,
  cookie:{
    maxAge:(1000 * 60 * 60 * 2),
    secure: false,
    httpOnly: true},
  resave: true,
  saveUninitialized: false,
  rolling: true
}))

// Routes
app.use('/comments',commentRouter);


app.get('/session',(req,res)=>{
  
  if(!req.session.user) return res.json({isLoggedIn:false});

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

app.get('/', (req,res)=>{
  req.session.id="This is from session"
  console.log('This is what we\'re dealing with ',req.session)
  res.status(200).json("Do you work?")
})

app.post('/signin',(req,res)=>{
  
  const { email,password } = req.body;
  const findEmailQuery = "SELECT * FROM user_details WHERE email = $1;";
  const parameters = [email];

  if(!email|!password)  return res.status(400).json("Invalid form submission");
  
  if(!req.session.user) req.session.user = {};

  db.makeQuery(parameters,findEmailQuery)
  .then(data=>{
    if(data.length===0) return res.json('Email or password is invalid');
    return data;
  })
  .then(rows=>bcrypt.compare(password,rows[0].password))
  .then(isValid=>{
    if(isValid){
      return db.makeQuery(parameters,findEmailQuery)
    }
    else{
      return res.status(400).json('Invalid username or password')
    }
  })
  .then(item=>{
    req.session.user.id=item[0].id; 
    res.json({
      user:{
        id:item[0].id, 
        name:item[0].name, 
        email:item[0].email
      }
    });
  })

 
})

app.post('/register',(req,res)=>{

  const { name,email,password } = req.body
  const newUserQuery = "INSERT INTO user_details(name,email,password,created_at) VALUES ($1,$2,$3,$4) RETURNING *;";

  if(!name|!email|!password)  return res.status(400).json("Invalid form submission");
  
  req.session.user = {}
  
  bcrypt.hash(password,saltRounds)
  .then(hash => db.makeQuery([ name, email, hash, new Date()], newUserQuery))
  .then(item=>{
    req.session.user.id=item[0].id; 
    res.json({
      user:{
        id:item[0].id, 
        name:item[0].name, 
        email:item[0].email
      }
    });
  })

})


app.listen(5000,()=>console.log('Listening on port 5000'))


 // .then(item=>{
  //   jwt.sign({
  //     data:{id:item[0].id}
  //   },
  //     process.env.REACT_JWT_TOKEN,
  //     { expiresIn: '6h' },
  //     (err,token)=>{
  //       if(err) res.json(err);
  //       res.json({ token, user:{id:item[0].id, name:item[0].name, email:item[0].email}})
  //       }
  //   );
  // })











