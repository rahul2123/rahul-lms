var contentstack = require("contentstack-express");
var redis = require("redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var client = redis.createClient();
// multiparty = require('multiparty');

function checksession(req, res, next) {
    if (req.url == '/' || req.url == '/login' && req.method == 'POST' || req.url == '/register' || req.url == '/register-user' || req.url == "/admin/login" || req.url =='/admin/super-admin-login') {
        console.log('called next',req.url)
        next()
    } else if (!req.session.user) {
        res.redirect('/')
    } else {
        next()
    }
}


function checkadmin(req, res, next) {
        console.log('req.url',req.url)
    if (req.session.user==='admin' || req.url == '/login' || req.url=='/super-admin-login')
        next()
    else
        res.redirect('/')
}

var urlencoded = bodyParser.urlencoded({
    extended: false
})

var app = contentstack();

app.use(urlencoded);
app.use(session({
    secret: 'lmstest',
    store: new redisStore({
        host: 'localhost',
        port: 6379,
        client: client
    }),
    saveUninitialized: false,
    resave: false
}));

app.use(checksession);
app.use('/admin',checkadmin)
app.listen((process.env.PORT || 4000));