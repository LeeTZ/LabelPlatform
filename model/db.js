var mongoose = require('mongoose');
var Schema = mongoose.Schema;
	//database define.
var UserSchema = new Schema({
	userName:String,
	password:String,
	userCreateTime:{type:Date},
	superuser:Boolean,
	expired:Boolean

});

UserSchema.methods.Register = function(callback){
	console.log(this.userName);
	var that = this;
	this.model('User').findOne({userName:this.userName}, function(err, kitten){
		if(err){
			callback(0, err);
		}
		if(kitten){
		
			callback(0, "username has been registered.");
		}
		else
		{
			console.log(this);
			that.save(function(err){
				if(err){
					callback(0, "save user error.");
				}
				callback(1, "register user success.");
			});
			

		}
	});
}

UserSchema.methods.Login = function(callback){
	var that = this;
	this.model('User').findOne({userName:that.userName}, function(err, kitten){
		if(err){
			callback(0, err);
		}
		if(kitten){
			if(kitten.password === that.password){
				callback(1, kitten);
			}
			else{
				callback(0, 'password error.');
			}

		}
		else
		{
			callback(0, 'user doesn\'t exist.');
		}
	});
}

UserSchema.statics.Calculate = function(callback){
	var that = this;
    var query = that.where({'expired':false});
    var userArray = new Array();
	query.exec(function(err, userList){
		if(err){
			callback(0, err);
			return;
		}
		var index = 0;
		var count = userList.length;
		var calculate = function(){
			if(index < count)
			{
				var user = userList[index];
                var userObject = user._doc;
				user.model('Pic').count({'createUser':user.userName}, function(err, count){
					if(err){
						callback(0, err);
						return;
					}
					userObject["createImageCount"] = count;
					user.model('Pic').count({'labelPointUser': user.userName}, function(err, count){
						if(err){
							callback(0, err);
							return;
						}
						userObject["labelPointCount"] = count;
						user.model('Pic').count({'labelShoulderUser':user.userName}, function(err, count){
							if(err){
								callback(0, err);
								return;
							}
							userObject["labelShoulderCount"] = count;
							user.model('Label').count({'validateUser':user.userName}, function(err, count){
								if(err){
									callback(0, err);
									return;
								}
								userObject["validateCount"] = count;
                                index ++;
                                userArray.push(userObject);
                                calculate();
							});

						});
					});
				});


			
			}
			else
			{
				callback(1, userArray);
				return;
			}

		}
        calculate();


	});

}
mongoose.model('User', UserSchema);



var PicSchema = new Schema({
	picUrl_s:String,
	picUrl_m:String,
	picUrl_l:String,
	picUrl:String,
	picAtOriginX:Number,
	picAtOriginY:Number,
	createUser:String,
	createTime:{type:Date},
	labelPointUser:String,
	labelPointTime:{type:Date},
	labelPosUser:String,
	labelPosTime:{type:Date},
	labelShoulderUser:String,
	labelShoulderTime:{type:Date},
	validateUser:String,
	validateTime:{type:Date},
	status:Number,/*status=0, Unlabeled, status = 1, Distributed, status=2, Finished, status = 3, Rejected.*/
	expireTime:{type:Date}

});

PicSchema.statics.AskImage= function(num, expiredtime, callback){
    var dateNow = new Date(Date.now());
    console.log(dateNow);
	var query = this.where({status:1}).where('expireTime').lte(dateNow);
	//query.setOptions({overwrite:true});
    var that = this;
    /*query.exec(function(err, list){
       console.log(list.length);
    });*/
	this.update(query,{status:0}, {multi:true},function(err, result){
		if(err){
			callback(0, 'update query error.');
		
		}
		else{
			that.where({status:0}).limit(num).exec(function(err, imagelist){

				if(err){
					console.log(err);
					callback(0, 'select image error.');

				}
				else
				{
					var time = new Date(Date.now());
					time.setMinutes(time.getMinutes() + expiredtime);
                    var Count = imagelist.length;
                    var index = 0;
                    var saveImage = function(){
                        item = imagelist[index];
                        item.expireTime = time;
                        console.log(time);
                        item.status = 1;
                        index ++;
                        item.save(function(err){
                            if(err){
                                callback(0, 'update pic status error.');
                            }
                            else{
                                if(index < Count)
                                {
                                    saveImage();
                                }
                                else
                                {
                                    callback(1, imagelist);
                                }
                            }

                        })

                    };
                    saveImage();

					
				}

			});
		}


	});
	 


};

var Pic = mongoose.model('Pic', PicSchema);
var ResultSchema = new Schema({
	expId:String,
	epoches:Number,
	trainRate:Number,
	testRate:Number
});
var Result = mongoose.model('Result', ResultSchema);
var ErrorSchema = new Schema({
	picId:String,
	errorUser:String,
	errorType:String
});
var Error = mongoose.model('Error', ErrorSchema);
var ExpSchema = new Schema({
	expTime:{type:Date},
	picNum:Number,
	epochs:Number,
	learningRate:Number,
	minLearningRate:Number
	//remain to compeleted.

});
var Exp = mongoose.model('Exp', ExpSchema);
var LabelSchema = new Schema({
	picId:String,
	labelType:String,
	labeler:String,
	leftShoulderX:Number,
	leftShoulderY:Number,
	leftMiddleShoulderX:Number,
	leftMiddleShoulderY:Number,
	leftNeckX:Number,
	leftNeckY:Number,
	rightShoulderX:Number,
	rightShoulderY:Number,
	rightMiddleShoulderX:Number,
	rightMiddleShoulderY:Number,
	rightNeckX:Number,
	rightNeckY:Number,
	chinX:Number,
	chinY:Number,
	noseX:Number,
	noseY:Number,
	position:Boolean,
	shoulderType:Boolean,
	valid:Boolean
});

LabelSchema.methods.LabelPicture = function(callback){
	var that = this;
	that.model('Pic').findById(that.picId, function(err, picture){
		if(err){
			callback(0, err);
			return;
		}
        if(picture) {
            that.model('Label').findOne({picId: that.picId}, function (err, label) {
                if (err) {
                    callback(0, err);
                    return;
                }

                if (label) {
                    var keys = ["leftShoulderX", "leftShoulderY", "leftMiddleShoulderX", "leftMiddleShoulderY", "leftNeckY", "leftNeckX", "rightShoulderX", "rightShoulderY", "rightMiddleShoulderX", "rightMiddleShoulderY", "rightNeckX", "rightNeckY", "labeler"];
                    var isContainAllKeys = true;
                    for (var type in keys) {
                        if (that[keys[type]] === undefined) {
                            isContainAllKeys = false;
                            break;
                        }
                    }
                    if (isContainAllKeys) {
                        for (var type in keys) {
                            label[keys[type]] = that[keys[type]];
                        }
                        picture.labelPointUser = that["labeler"];
                        picture.labelPointTime = Date.now();


                    }
                    if (that['position'] !== undefined) {
                        label['position'] = that['position'];
                        picture.labelPosUser = that["labeler"];
                        picture.labelPosTime = Date.now();
                    }
                    if (that['shoulderType'] !== undefined) {
                        label['shoulderType'] == that['shoulderType'];
                        picture.labelShoulderUser = that["labeler"];
                        picture.labelShoulderTime = Date.now();
                    }
                    label['valid'] = true;
                    label.save(function (err, label) {
                        if (err) {
                            callback(0, err);
                            return;
                        }
                        picture.save(function (err, picture) {
                            if (err) {
                                callback(0, err);
                                return;
                            }
                            callback(1, label);

                        });

                    });


                }
                else {
                    var Label = that.model('Label');
                    label = new Label();
                    label['valid'] = true;
                    label['picId'] = that.picId;
                    var keys = ["leftShoulderX", "leftShoulderY", "leftMiddleShoulderX", "leftMiddleShoulderY", "leftNeckY", "leftNeckX", "rightShoulderX", "rightShoulderY", "rightMiddleShoulderX", "rightMiddleShoulderY", "rightNeckX", "rightNeckY", "labeler", "labelType"];
                    var isContainAllKeys = true;
                    for (var type in keys) {
                        if (that[keys[type]] === undefined) {
                            isContainAllKeys = false;
                            break;
                        }
                    }
                    if (isContainAllKeys) {
                        for (var type in keys) {
                            label[keys[type]] = that[keys[type]];
                        }
                        picture.labelPointUser = that["labeler"];
                        picture.labelPointTime = Date.now();


                    }
                    if (that['position'] !== undefined) {
                        label['position'] = that['position'];
                        picture.labelPosUser = that["labeler"];
                        picture.labelPosTime = Date.now();
                    }
                    if (that['shoulderType'] !== undefined) {
                        label['shoulderType'] == that['shoulderType'];
                        picture.labelShoulderUser = that["labeler"];
                        picture.labelShoulderTime = Date.now();
                    }
                    label.save(function (err, label) {
                        if (err) {
                            callback(0, err);
                            return;
                        }
                        picture.save(function (err, picture) {
                            if (err) {
                                callback(0, err);
                                return;
                            }
                            callback(1, label);

                        });

                    });
                }

            });
        }

	});


}

var Label = mongoose.model('Label', LabelSchema);




