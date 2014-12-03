var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pic = mongoose.model('Pic');
var Label = mongoose.model('Label');
router.post('/', function(req, res) {
    var _labeler = req.body.user;
    var _picId = req.body.picId;
    var _labelType = "HUMAN";
    var _labelData = req.body.labelData;
    var _posData = req.body.position;
    var _shoulderType = req.body.shoulderType;
    var label = new Label();
    label.labeler = _labeler;
    label.picId = _picId;

    for(var key in _labelData){
        label[key] = _labelData[key];
    }
    label.labelType = "HUMAN";
    label.position = _posData;
    label.shoulderType = _shoulderType;
    label.valid = true;

    label.LabelPicture(function (status, msg) {
        res.json({'status': status, 'msg': msg});
    });
});



router.get('/', function(req, res){
	res.send("remain to complete.");
});

module.exports = router;