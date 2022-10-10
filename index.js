//dependences
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

//execution express
const app = express()

//connection bd
const conn = require('./db/conn')

//call models
const User = require('./models/User')
const Thoughts = require('./models/Thoughts')

//import routes
const thoughtsRoutes = require('./routes/thoughtRoute')
const AuthRoutes = require('./routes/AuthRoutes')

//import ThoughtController
const ThoughtController = require('./controllers/ThoughtController')

//template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//body requisition
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json())

//session midleware
app.use(session({
    name:'session',
    secret:'nosso_secret',
    resave:'false',
    saveUninitialized:'false',
    store: new FileStore({
        logFn: function () {},
        path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
        secure:false,
        maxAge:3600000,
        expires: new Date(Date.now + 3600000),
        httpOnly: true
    },
}))
//flash messsages
app.use(flash())
//static styles
app.use(express.static('public'))



//set session to res
app.use((req, res, next) =>{
    if(req.session.userId){
        res.locals.session = req.session
    }
    next()
})
//routes
app.use('/thoughts', thoughtsRoutes)
app.use('/', AuthRoutes)
app.get('/', ThoughtController.showThoughts)

conn.sync()
    .then(app.listen(3000, console.log('Rodando na porta 3000')))
    .catch(err => console.log(`problema com o servidor: ${err}`))