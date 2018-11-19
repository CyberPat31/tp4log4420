const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const Order = mongoose.model('Order');
const Product = mongoose.model('Product');
const validator = require('validator');

router.get("/", (req, res) => {
	if(typeof req.session.cart !== 'undefined'){
	  var array = [];
	  console.log[req.session.cart];
	  for(var i = 0; i < req.session.cart.length; i++){
		  array.push(req.session.cart[i]);
	  }
	  console.log(array);
      res.json(array);
    }
	else{
	  var array = [];
	  console.log(array);
      res.json(array);
    }
	res.status(200);
});

router.get("/:productId", (req, res) => {
	if(typeof req.session.cart !== 'undefined'){;
		var response;
		var productFound = false;
		for(var i = 0; i < req.session.cart.length; i++){
			if(req.params.productId == req.session.cart[i].productId)
			{
				response = req.session.cart[i];
				productFound = true;
			}
		}
		if (productFound){
			res.json(response);
			res.status(200);
		}
		else{
			res.status(404);
			res.json(response);
		}
    }
	else{
		res.status(404);
		res.json('[]');
    }
});

router.post("/", (req, res) => {
	// Data validation
	var isUpdateValid = false;
	var body = req.body;
	if(validator.isNumeric(JSON.stringify(body.productId), true) &&
		!validator.isEmpty(JSON.stringify(body.productId)) &&
		validator.isNumeric(JSON.stringify(body.quantity), true) &&
		!validator.isEmpty(JSON.stringify(body.quantity))
	){
		isUpdateValid = true;
	}
	var isProductIdValid = true;
	Product.find(function (err, docs) {if (err) {console.log('Error Product.find')}}).then(result => {
		if (result.length < 1) {
		  isProductIdValid = false;
		  isUpdateValid = false;
		}
		});
	if(isUpdateValid){
		if(typeof req.session.cart !== 'undefined'){;
			var array = [];
			var productFound = false;
			console.log(req.session.cart);
			for(var i = 0; i < req.session.cart.length; i++){
				if(req.body.productId == req.session.cart[i].productId)
				{
					productFound = true;
				} 
				else 
				{
					array.push(req.session.cart[i]);
				}
			}
			if (!productFound){
				array.push(req.body);
				req.session.cart = array;
				res.status(201);
				req.session.save(function(err){
					if(err){
						console.log(' POST ERROR ', err);
					}
				})
			}
			else {
				res.status(400);
			}
			res.json(req.session.cart);
		}
		else{
			var array = [];
			array.push(req.body);
			req.session.cart = array;
			res.status(201);
			req.session.save(function(err){
				if(err){
					console.log(' POST ERROR ', err);
				}
			})
			res.json(array);
		}
	}
	else{
		if (!isProductIdValid){
			res.status(400);
		}
		else {
			console.log("Bad parameters")
			res.status(400);
			res.render('error400');
		}
	}
});

router.put("/:productId", (req, res) => {
	// Data validation
	var isUpdateValid = false;
	var body = req.body;
	console.log(req.body);
	if(validator.isNumeric(JSON.stringify(body.quantity), true) &&
	!validator.isEmpty(JSON.stringify(body.quantity))
	){
		isUpdateValid = true;
	}
	if(isUpdateValid){
		if(typeof req.session.cart !== 'undefined'){
			var array = [];
			var productFound = false;
			console.log(req.session.cart);
			for(var i = 0; i < req.session.cart.length; i++){
				if(req.params.productId == req.session.cart[i].productId)
				{
					productFound = true;
					req.session.cart[i].quantity = req.body.quantity;
					array.push(req.session.cart[i]);
				} 
				else {
				array.push(req.session.cart[i]);
				}
			}
			if (!productFound){
				req.session.cart = array;
				res.status(204);
				req.session.save(function(err){
					if(err){
						console.log(' PUT ERROR ', err);
					}
				})
			}
			else {
				res.status(404);
			}
			console.log(req.session.cart);
			res.json(req.session.cart);
		}
		else{
			var array = [];
			array.push(req.body);
			req.session.cart = array;
			req.session.save(function(err){
				if(err){
					console.log(' PUT ERROR ', err);
				}
			})
			console.log(array);
			res.json(array);
		}
    }
    else{
		console.log("Bad parameters")
		res.status(400);
		res.render('error400');
    }
});

router.delete("/:productId", (req, res) => {
    if(typeof req.session.cart !== 'undefined'){
		var array = [];
		var productFound = false;
		for(var i = 0; i < req.session.cart.length; i++){
			if(req.params.productId == req.session.cart[i].productId){
				productFound = true;
			} 
			else {
				array.push(req.session.cart[i]);
			}
		}
		if (productFound){
			req.session.cart = array;
			res.status(204);
			req.session.save(function(err){
				if(err){
					console.log(' POST ERROR ', err);
				}
			})
		}
		else {
			res.status(404);
		}
		res.json(req.session.cart);
    }
	else{
		res.json('[]');
    }
});

router.delete("/", (req, res) => {
	if(typeof req.session.cart !== 'undefined'){
		req.session.cart = [];
		req.session.save(function(err){
			if(err){
				console.log(' POST ERROR ', err);
			}
		})
		res.status(204);
        res.json(req.session.cart);
    }
	else{
		res.json('[]');
    }
});

module.exports = router;