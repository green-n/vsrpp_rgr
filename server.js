if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const Sequelize = require('sequelize');


const sequelize = new Sequelize("vsrpp_crud", "root", "root", {
    host: 'localhost',
    dialect: 'mysql'
    });


const  Users  = require('./models/users')(sequelize,Sequelize);
const SleepData  = require('./models/sleep_data')(sequelize,Sequelize);


const initializePassport = require('./passport_config');
const res = require('express/lib/response');
const req = require('express/lib/request');
const { send } = require('express/lib/response');

initializePassport(
    passport,
    email => Users.findOne({ where: { email } }),
    id => Users.findOne({ where: { id } })
);

// app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
//import toJSON


app.use(express.json());








/////////////////////////////////////////////////////////////////////////////

app.get('/', checkAuthenticated,async (req, res) => {
    if(req.user===undefined){
        res.send("welcome, please log in")
    }
    else{
    const userLocal = JSON.parse(JSON.stringify(await req.user));
    res.send("Hello "+ userLocal.name)
      }
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
   
}));



app.put('/register', checkNotAuthenticated, async (req, res) => {
    const checkUser = await Users.findOne({ where: { email: req.body.email } });
    console.log(checkUser)
    if(checkUser != null){
        res.send('email already exists')
    }
    else{
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
        Users.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            rights: "user"
        })
      res.send("success")
    } catch {
      res.send("error")
    }
  }})

  app.get('/userinfo', checkNotAuthenticated, async (req, res) => {
      if(req.user===undefined){
          res.send("please log in")
      }
        else{
      const userLocal = JSON.parse(JSON.stringify(await req.user));
      localInfo ={
            name: userLocal.name,
            email: userLocal.email,
            rights: userLocal.rights
      }
      res.send(localInfo)
      }})

    app.patch('/user',checkNotAuthenticated,async (req, res) =>{
        if(req.user===undefined){
            res.send("please log in")
        }
          else{
        const userLocal = JSON.parse(JSON.stringify(await req.user));
        const user = await Users.findOne({ where: { id: userLocal.id } })
        if(req.body.name){
           user.update({
                name: req.body.name
            })}
        if(req.body.password){
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
           user.update({
                password: hashedPassword
            })}
        res.send("success")
        user.save()
    }}) 

    app.delete('/logout',async (req, res) => {
        if(req.user===undefined){
            res.send("please log in")
        }
        else{
        const userLocal = JSON.parse(JSON.stringify(await req.user));
        Users.destroy({
            where: {
                id: userLocal.id
            }
        })

        req.logOut()
        
        res.send("logged out,goodbye. Thanks for fish")
      }})

      app.post('/addnight',checkAuthenticated,async (req, res) => {
        if(req.user===undefined){
            res.send("please log in")
        }
        else{
            console.log(req.user)
        const userLocal = JSON.parse(JSON.stringify(await req.user));
        SleepData.create({
            userId: userLocal.id,
            sleepTime: req.body.sleepTime,
            sleepQuality: req.body.sleepQuality,
        })
        res.send("success")
        }})


        app.get('/qualitydreams',checkAuthenticated,async (req, res) => {
            if(req.user===undefined){
                res.send("please log in")
            }
            else{
            
            const userLocal = JSON.parse(JSON.stringify(await req.user));
            const all_nights =JSON.parse(JSON.stringify( await SleepData.findAll({ where: { userId: userLocal.id } })))
            let Temp_nights = []
            for(let elm of all_nights){
                if(elm.sleepQuality>=req.body.sleepQuality){
                    Temp_nights.push(elm)
                }
            }
            if(Temp_nights.length===0){
                res.send("nothing")
            }
            else{
            res.send(Temp_nights)
            }
        }
        })
/////////////////////////////////////////////////////////////////////////////////////

















const PORT=3000;

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.send("please log in")
  }

sequelize.sync().then(() => {
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
});