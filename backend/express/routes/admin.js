var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
    if(req.cookies.authorized) {
        res.render('admin', {content: 'Login successfully!'});
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
