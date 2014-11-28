var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
/*register */
router.get('/', function(req, res) {

	var registerUser = new User({userName:'wangxu', password:'123456', userCreateTime:Date.now(), superuser:false, expired:false});
	registerUser.Register(function(err, status){
		console.log(err);
		if(err){
			console.log('err');
			return;
		}
		registerUser.save(function(err){
			console.log(err);
			res.send("register.");
		});
	})
	
});

module.exports = router;