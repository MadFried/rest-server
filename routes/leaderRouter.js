	var express = require('express');
	var bodyParser = require('body-parser');
	var leaderRouter = express.Router();

	leaderRouter.use(bodyParser.json());


	leaderRouter.route('/')
	.get(function(req,res,next) {
		res.end('sending all leaders names to you!')
	})

	.post(function(req,res,next) {
		res.end('created:' + req.body.name + 'with description:' + req.body.description);
	})

	.delete(function(req, res, next) {
		res.end('delete all leader items!');
	});

	leaderRouter.route('/:leaderId')
	.get(function(req, res, next) {
		res.end('sending:' + req.params.leaderId + '')
	})

	.put(function(req, res, next) {
		res.write('updating:' + req.params.leaderId + '\n');
		res.end('updated:' + req.body.name + 'with description:' + req.body.description);
	})

	.delete(function(req, res, next) {
		res.end('deleted:' + req.params.leaderId)
	});

	module.exports = leaderRouter;