var express =  require('express');
var mysql = require('mysql');
var $conf = require('../config/mysqlConn');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
var router = express.Router();
app.use(router);

var connection = mysql.createConnection({
    host: $conf.mysql.host,
    user: $conf.mysql.user,
    password: $conf.mysql.password,
    database: $conf.mysql.database,
    port: $conf.mysql.port
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    connection.query("select * from users where id = " + id,function(err, rows){
        done(err, rows[0]);
    });
});

passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        alert(username);
        alert(password);
        connection.query("SELECT * FROM `users` WHERE `username` = '" + username + "'",function(err, rows) {
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false);
            }

            if (!( rows[0].password == password))
                return done(null, false);

            return done(null, rows[0]);
        });
    }
));

app.use(passport.initialize());
app.use(passport.session());

/* Get login interface */
router.get('/', function(req, res, next) {
    console.log("SessionID is" + req.sessionID);
    res.render('login', {flag: 0});
});

/* Deal with login request */
router.post('/', function(req, res, next) {
    passport.authenticate('local-login', (err, user, info) => {
        if(info) {return res.send(info.message)}
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.login(user, (err) => {
            if (err) { return next(err); }
            return res.redirect('/admin');
        })
    })(req, res, next);
});

module.exports = app;