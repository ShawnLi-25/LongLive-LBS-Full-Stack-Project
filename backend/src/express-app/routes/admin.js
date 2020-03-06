var express = require('express');
var getRouter = express.Router();

getRouter.get('/admin', function (req, res) {
    if(req.cookies.authorized) {
        res.render('admin', {content: 'Login with user cookie!'});
    } else {
        res.redirect('/login');
    }
});

exports.get = getRouter;