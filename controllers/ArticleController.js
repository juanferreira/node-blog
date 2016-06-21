module.exports = function(app, mongoose){

	var Article = mongoose.model("Article"),
		utils = require('../lib/utils');

	app.get('/article/new', utils.ensureAuthenticated, function(req, res){
		res.render("article-new");
	});

	app.post('/article/create', utils.ensureAuthenticated, function(req, res){
		var title = req.body.title,
			content = req.body.content,
			articleModel = new Article();

		articleModel.title = title;
		articleModel.content = content;
		articleModel.author = "anonymous";
		articleModel.save(function(err, data){
			if(err){
				res.render("error", {error: err});
			}else{
				var id = data._id;
				res.redirect("/article/show/" + id);
			}
		});
	});

	app.get('/article/show/:id', function(req, res){
		var id = req.params.id;

		Article.findOne({ "_id" : id }, function(err, data){
			if(err){
				res.render("error", {error: err});
			}else{
				res.render("article-detail", {
					articleInfo: data
				});
			}			
		});
	});
};