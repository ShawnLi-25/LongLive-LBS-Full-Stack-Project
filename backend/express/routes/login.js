var express =  require('express');
var getRouter = express.Router();
var postRouter = express.Router();

/* Get login interface */
getRouter.get('/login', function(req, res, next) {
    res.render('login', {flag: 0});
});

/* Deal with login request */
postRouter.post('/login', function(req, res) {
    if(req.body.username === 'shawn' && req.body.password == 'cs411') {
        res.cookie('authorized', req.body.username);
        res.redirect('/admin');
    }
    else{
        res.render('login', {flag: 1});
    }
})

exports.get = getRouter;
exports.post = postRouter;