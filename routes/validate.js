var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pic = mongoose.model('Pic');
/* GET home page. */
router.post('/', function(req, res) {
    var picId = req.body.picId;
	var validated = req.body.validated;
    var validatedUser = req.body.userName;
	Pic.Validate(picId, validatedUser, validated, function(status, msg){
		res.json({'status':status, 'msg':msg});
	})
});

module.exports = router;