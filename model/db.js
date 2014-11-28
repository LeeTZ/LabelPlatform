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
	minLearningRate:Number,
	//remain to compeleted.

});
var Exp = mongoose.model('Exp', ExpSchema);
var LabelSchema = new Schema({
	picId:String,
	labelType:String,
	labelerId:String,
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


var Label = mongoose.model('Label', LabelSchema);




