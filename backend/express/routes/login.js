var express =  require('express');
var mysql = require('mysql');
var $conf = require('../config/mysqlConn');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwordHash = require('password-hash');

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
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
    /*
        connection.query("SELECT * FROM users WHERE id = '" + id + "'",function(err, rows){
            if(rows.length)
                done(null, rows[0]);
        });
    */
});

/* login strategy */
passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        connection.query("SELECT * FROM users WHERE email = '" + email + "'",function(err, rows) {
            if (err)
                return done(err);

            if(rows.length && passwordHash.verify(password, rows[0].password)) {
                return done(null, rows[0]);
            }

            // No such user, automatically register
            else if (!rows.length) {

                const hashedPassword = passwordHash.generate(password);
                var newUser = new Object();
                newUser.email = email;
                newUser.password = hashedPassword;

                const registerQuery = "INSERT INTO users(id, email, password) VALUES (DEFAULT,'" + email +  "', '" + hashedPassword + "')";
                connection.query(registerQuery, function (err, row) {
                    if(err)
                        return done(err);
                    newUser.id = row.insertId;
                    return done(null, newUser);
                })
            }

            // invalid username password pair
            return done(null, false);
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
        if (info) { return res.send(info.message); }
        if (err) { return next(err); }

        if(user) {
            console.log("Login successfully");
            // Todo: Route to Map
            return res.json({
                code:'200',
                msg: 'Login Successfully'
            });
            // return res.redirect('/admin');
        }
    })(req, res, next);
});

module.exports = app;