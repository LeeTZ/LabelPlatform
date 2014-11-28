var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
/*register */
router.get('/', function(req, res) {

	var registerUser = new User({userName:'ihey', password:'123456', userCreateTime:Date.now(), superuser:false, expired:false});
	registerUser.Register(function(err, status){
		console.log(err);
		console.log(status);
		if(err){
			console.log('err');
			res.send("error happend.");
		}
		registerUser.save(function(err){
			console.log(err);
			res.send("register.");
		});
	})
	
});

router.post('/', function(req, res){
	var _userName = req.body.userName;
	var _password = req.body.password;
	var registerUser = new User({userName:_userName, password:_password,userCreateTime:Date.now(), superuser:false, expired:false});
	registerUser.Register(function(status, msg){
		res.json({'status':status, 'msg':msg});

	});
});



module.exports = router;