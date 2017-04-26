
	var express = require('express');
	var bodyParser = require('body-parser');
	var mongoose = require('mongoose');
	var Verify = require('./verify');

	var Works = require('../models/works');

	var workRouter = express.Router();


	workRouter.use(bodyParser.json());


	workRouter.route('/')
	.get(findAllWorks)

	.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req,res,next) {
		Works.create(req.body, function (err,work) {
			if(err) throw err;

			console.log('work created!');
			var id = work._id;
			res.writeHead(200, {
				'Content-Type' : 'text/plain'
			});

			res.end('Added the work with id:' + id);
		});
	})

	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
		Works.remove({}, function (err, resp) {
			if(err) throw err;
			res.json(resp);
		});
	});

	function findAllWorks(req,res,next) {

		Works.find(req.query)
			.populate('comments.postedBy')
			.exec(function (err, work) {
				if (err) next(err);
				res.json(work);
			});
	}

	workRouter.route('/:workId')
	.get(function(req, res, next) {
		Works.findById(req.params.workId)
			.populate('comments.postedBy')
			.exec(function (err, work) {
			if(err) next(err);

			res.json(work);
		});
	})

	.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {

		Works.findByIdAndUpdate(req.params.workId, {
			$set: req.body
		}, {
			new: true
		}, function (err, work) {
			if (err) throw err;
			res.json(work);
		});
	})

	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {

		Works.findByIdAndRemove(req.params.workId, function (err, resp) {
			if(err) throw err;
			res.json(resp);
		});
	});

	workRouter.route('/:workId/comments')
		.get(function(req, res, next) {

			Works.findById(req.params.workId)
				.populate('comments.postedBy')
				.exec(function (err, work) {
				if (err) next(err);

				res.json(work.comments);
			});

		})

		.post(Verify.verifyOrdinaryUser, function (req, res, next) {
			Works.findById(req.params.workId, function (err, work) {
				if (err) next(err);

				req.body.postedBy = req.decoded._id;

				work.comments.push(req.body);
				work.save(function (err, work) {
					if (err) throw err;
					console.log('Updated Comments!');
					res.json(work);
				});
			});
		})

		.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {

			Works.findById(req.params.workId, function (err, work) {
				if (err) throw err;

				for (var i = (work.comments.length - 1); i >= 0; i--) {
					work.comments.id(work.comments[i]._id).remove();
				}
				work.save(function (err, result) {
					if (err) throw err;
					res.writeHead(200, {
						'Content-Type': 'text/plain'
					});
					res.end('Deleted all comments!');
				});
			});
		});

	workRouter.route('/:workId/comments/:commentId')

		.get(Verify.verifyOrdinaryUser, function (req, res, next) {
			Works.findById(req.params.workId)
				.populate('comments.postedBy')
				.exec(function (err, work) {
				if (err) throw err;
				res.json(work.comments.id(req.params.commentId));
			});
		})

		.put(Verify.verifyOrdinaryUser, function (req, res, next) {
			// We delete the existing commment and insert the updated
			// comment as a new comment
			Works.findById(req.params.workId, function (err, work) {
				if (err) next(err);
				work.comments.id(req.params.commentId).remove();

				req.body.postedBy = req.decoded._id;

				work.comments.push(req.body);
				work.save(function (err, work) {
					if (err) throw err;
					console.log('Updated Comments!');
					res.json(work);
				});
			});
		})

		.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
			Works.findById(req.params.workId, function (err, work) {

				if(work.comments.id(req.params.commentId).postedBy != req.decoded._id) {
					var err = new Error('U are not authorized to perform this operation!');
					err.status = 403;
					return next(err);
				}
				work.comments.id(req.params.commentId).remove();
				work.save(function (err, resp) {
					if (err) next(err);
					res.json(resp);
				});
			});
		});




	module.exports = workRouter;