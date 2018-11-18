const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const Product = mongoose.model('Product')

router.get("/api/products", (req, res) => {
  let response;
  let criteria = 'price-asc';
  let sort;
  if (req.query.criteria){criteria = req.query.criteria}
  switch (criteria){
    case 'price-asc':
      sort = 'price';
      break;
    case 'price-dsc':
      sort = '-price';
      break;
    case 'alpha-asc':
      sort = 'name';
      break;
    case 'alpha-dsc':
      sort = '-name';
      break;
    default:
      next(); // error 404 wrong criteria
  }

  if (req.query.category){
    if (['cameras', 'computers', 'consoles', 'screens'].indexOf(req.query.category) < 0) {
    next(); //error 404 wrong category 
    }
    Product.find({category: req.query.category},function (err, docs) {if (err) {console.log('Error Product.find')}}).sort(sort).then(result => {
    if (result.length < 1) {
      console.log('No product in DB')
      response = '';
    } else {
      console.log('Product(s) found in DB :')
      response = result
      console.log(result)
    }
  });
  }else{
    Product.find(function (err, docs) {if (err) {console.log('Error Product.find')}}).sort(sort).then(result => {
    if (result.length < 1) {
      console.log('No product in DB')
      response = '';
    } else {
      console.log('Product(s) found in DB :')
      response = result
      console.log(result)
    }
  });
  }
  res.json(response);
});

router.get("/api/products/:id", (req, res) => {
  let response;
  Product.find({id: req.params.id}, function (err, docs) {if (err) {console.log('Error Product.find')} }).then(result => {
      if (result.length < 1) {
        console.log('error 404 product not found')
        res.status(404);
        res.render('error404');
      } else {
        console.log('Product found in DB :')
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

router.post("/api/products", (req, res) => {
  let response;
  Product.create(req.body, function(err, product) {
    if(err) { 
      console.log(err)
      res.status(400);
      res.render('error404'); //bad request
    }
    response = JSON.stringify(product);
  });
  res.json(response);
});

router.delete("/api/products/:id", (req, res) => {
  let response;
  Product.find({id: req.params.id}, function (err, docs) {if (err) {console.log('Error Product.find')} }).then(result => {
      if (result.length < 1) {
        console.log('error 404 product not found')
        res.status(404);
        res.render('error404');
      } else {
        response = result
        Product.remove({ id: req.params.id }, function (err) {
          if (err) {console.log('Error Product.find')}
        }); 
        console.log('Product found and deleted in DB :')
        console.log(response)
        res.json(response);
      }
    }).catch(err =>{
      console.log('error')
      res.status(500);
      res.render('error404');
    });
});

router.delete("/api/products", (req, res) => {
  let response;
  Product.remove({}, function (err) {
    if (err) {
      console.log('Error')} 
    response = 'All products deleted';
    res.json(response);
  });  
});

module.exports = router;
