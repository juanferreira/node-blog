module.exports = function(app, mongoose){

	var Article = mongoose.model("Article"),
		Comment = mongoose.model("Comment"),
		utils = require('../lib/utils');

	app.post("/comment/create", utils.ensureAuthenticated, function(req, res){
		var text = req.body.text,
			articleID = req.body.articleId;

		Article.findOne({ "_id" : articleID }, function(err, data){
			if(err || typeof data == "undefined"){
				res.render("error", { err: err });
			}else {
				var CommentModel = new Comment();
				commentModel.text = text;
				commentModel.author = "anonymous";
				data.comments.push(commentModel);
				CommentModel.save(function(err, data){
					if(err){
						res.render("error", { err: err });
					}else{
						res.redirect("/article/show/" + articleID);
					}
				});
			}
		});
	});
};