var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
/* GET home page. */
router.get('/', function(req, res) {
	
	User.Calculate(function(status, msg){
		res.json({'status':status, 'msg':msg});
	});
});

module.exports = router;