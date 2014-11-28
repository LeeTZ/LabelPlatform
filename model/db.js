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
	this.model('User').findOne({userName:this.userName}, function(err, kitten){
		if(err){
			callback(err);
		}
		if(kitten){
			console.log(kitten);
		}
		else
		{
			console.log(this);
			this.save(callback);
			

		}



	});
}
mongoose.model('User', UserSchema);
UserSchema.methods.Login = function(name, pass, callback){
	this.findOne({userName:name}, function(err, kitten){
		if(err){
			callback(err);
		}
		if(kitten){
			Console.log(kitten);
		}
	});
}




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
	status:Number,
	expireTime:{type:Date}

});
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




