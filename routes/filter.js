var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pic = mongoose.model('Pic');
/* GET home page. */
router.get('/', function(req, res) {
	
	Pic.Filter(num, expiredtime, function(status, msg){
		res.json({'status':status, 'msg':msg});
	})；
});

module.exports = router;