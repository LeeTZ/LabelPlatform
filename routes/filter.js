var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pic = mongoose.model('Pic');
/* GET home page. */
router.post('/', function(req, res) {
	var type = req.body.type;
	Pic.Filter(type, function(status, msg){
		res.json({'status':status, 'msg':msg});
	});
});

module.exports = router;