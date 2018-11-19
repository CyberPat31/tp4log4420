const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const Order = mongoose.model('Order')
const validator = require('validator');

router.get("/", (req, res) => {
  let response;
  Order.find(function (err, docs) {if (err) {console.log('Error Order.find')}}).then(result => {
  if (result.length < 1) {
    console.log('No order in DB')
    response = '';
  } else {
    console.log('Order(s) found in DB :')
    response = result
    console.log(result)
  }
  });
  res.json(response);
});

router.get("/:id", (req, res) => {
  let response;
  Order.find({id: req.params.id}, function (err, docs) {if (err) {console.log('Error Order.find')} }).then(result => {
      if (result.length < 1) {
        console.log('error 404 order not found')
        res.status(404);
        res.render('error404');
      } else {
        console.log('Order found in DB :')
        response = result
        console.log(response)
        res.json(response);
      }
    }).catch(err =>{
      console.log('error')
      res.status(500);
      res.render('error404');
    });
});

router.post("/", (req, res) => {
  let response;
  // Data validation
  var isOrderValid = false;
  var body = req.body;
  if(validator.isNumeric(JSON.stringify(body.id), true) &&
	!validator.isEmpty(JSON.stringify(body.id)) &&
	!validator.isEmpty(body.firstName) &&
	!validator.isEmpty(body.lastName) &&
	validator.isEmail(body.email) &&
	!validator.isEmpty(body.email) &&
	validator.isMobilePhone(body.phone, 'en-CA') &&
	!validator.isEmpty(body.phone)
	){
		isOrderValid = true;
	}
  for(var i = 0; i < body.products.length; i++){
	  if(!validator.isNumeric(JSON.stringify(body.products[i].id), true) || !validator.isNumeric(JSON.stringify(body.products[i].quantity), true)){
		  isOrderValid=false;
	  }
  }
  if(isOrderValid){
	  // Order creation
	  Order.create(req.body, function(err, order) {
		if(err) { 
			console.log(err)
			res.status(400);
			res.render('error404'); //bad request
		}
		response = JSON.stringify(order);
	});
	res.json(response);
  }
  else{
	  console.log("Bad parameters")
	  res.status(400);
	  res.render('error400');
  }
});

router.delete("/:id", (req, res) => {
  let response;
  Order.find({id: req.params.id}, function (err, docs) {if (err) {console.log('Error Order.find')} }).then(result => {
      if (result.length < 1) {
        console.log('error 404 order not found')
        res.status(404);
        res.render('error404');
      } else {
        response = result
        Order.remove({ id: req.params.id }, function (err) {
          if (err) {console.log('Error Order.find')}
        }); 
        console.log('Order found and deleted in DB :')
        console.log(response)
        res.json(response);
      }
    }).catch(err =>{
      console.log('error')
      res.status(500);
      res.render('error404');
    });
});

router.delete("/", (req, res) => {
  let response;
  Order.remove({}, function (err) {
    if (err) {
      console.log('Error')} 
    response = 'All orders deleted';
    res.json(response);
  });  
});

module.exports = router;