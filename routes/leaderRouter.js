	var express = require('express');
	var bodyParser = require('body-parser');
	var mongoose = require('mongoose');

	var Verify = require('./verify');
	var Leaders = require('../models/leadership');

	var leaderRouter = express.Router();



	leaderRouter.use(bodyParser.json());


	leaderRouter.route('/')
	.get(function(req,res,next) {
		Leaders.find(req.query)
			.exec(function (err, leader) {
				if (err) next(err);
				res.json(leader);
			});
	})

	.post(function(req,res,next) {
		res.end('created:' + req.body.name + 'with description:' + req.body.description);
	})

	.delete(function(req, res, next) {
		res.end('delete all leader items!');
	});


	leaderRouter.route('/:leaderId')
	.get(function(req, res, next) {
		Leaders.findById(req.params.leaderId)
			.exec(function (err, leader) {
				if(err) next(err);

				res.json(leader);
			});
	})

	.put(function(req, res, next) {
		res.write('updating:' + req.params.leaderId + '\n');
		res.end('updated:' + req.body.name + 'with description:' + req.body.description);
	})

	.delete(function(req, res, next) {
		res.end('deleted:' + req.params.leaderId)
	});

	module.exports = leaderRouter;