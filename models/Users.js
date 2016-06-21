module.exports = function(mongoose){
	var Schema = mongoose.Schema;

	var UserSchema = new Schema({
		name: String,
		email: String,
		password: String,
		registerDate: {
			type: Date,
			default: Date.now
		}
	});

	mongoose.model('User', 'UserSchema');
};