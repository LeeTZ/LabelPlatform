var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Label = mongoose.model('Pic');
/* GET home page. */
router.post('/', function(req, res) {
	var num = req.query.num;
    if(num==undefined)
    {
        num = 10;
    }
	var expiredtime = req.query.expiredtime;
    if(expiredtime== undefined)
    {
        expiredtime = 5;
    }
	Label.AskImage(num, expiredtime, function(status, msg){
		res.json({'status':status, 'msg':msg});
	})
});

module.exports = router;