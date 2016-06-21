module.exports = function(app, mongoose){

	app.get("/", function(req, res){
		res.render("index");
	});

	app.get("/user/:id", function(req, res){
		var id = req.params.id;

		res.json({ userid: id });
	});

	app.post("/user/create", function(req, res){
		var id = req.body.id;

		res.json({ userid: id });
	});
};