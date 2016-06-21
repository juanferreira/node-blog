module.exports = function(mongoose){
	var Schema = mongoose.Schema;

	var CommentSchema = new Schema({
		text: String,
		author: String,
		createData: {
			type: Date,
			default: Date.now
		}
	});

	mongoose.model('Comment', CommentSchema);
};