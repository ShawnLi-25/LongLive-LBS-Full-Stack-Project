var express =  require('express');
var mysql = require('mysql');
var $conf = require('../config/mysqlConn');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwordHash = require('password-hash');
var query = require('../database/dbQuery');

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
    // done(null, id);
    connection.query("SELECT * FROM users WHERE id = '" + id + "'",function(err, rows){
        if(rows.length)
            done(null, rows[0]);
    });
});

/* login strategy */
passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        connection.query(query.login, [email], function(err, rows) {
            if (err)
                return done(err);

            if(rows.length) {
                if(passwordHash.verify(password, rows[0].password)) {
                    // Find user, return
                    return done(null, rows[0]);
                }
                else {
                    // Invalid username password pair
                    return done(null, false);
                }
            } else {
                // No such user, automatically register
                const hashedPassword = passwordHash.generate(password);
                var newUser = new Object();
                newUser.email = email;
                newUser.password = hashedPassword;

                connection.query(query.register, [email, hashedPassword], function (err, row) {
                    if(err)
                        return done(err);
                    newUser.id = row.insertId;
                    return done(null, newUser);
                })
            }
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
    passport.authenticate('local-login', { session: false }, (err, user, info) => {
        if (info) { return res.send(info.message); }
        if (err) { return next(err); }

        if(user) {
            console.log("Login successfully");
            return res.json({
                code:'200',
                msg: 'Login Successfully'
            });
        } else {
            // Wrong password
            console.log("Wrong Password");
            return res.json({
                code:'403',
                msg: 'Wrong Password'
            });
        }
    }) (req, res, next);
});

module.exports = app;
