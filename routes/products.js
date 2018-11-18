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
        console.log('Product not found in DB')
        next();
      } else {
        console.log('Product found in DB :')
        response = result
        console.log(result)
      }
    });
  res.json(response);
});

router.post("/api/products", (req, res) => {
  let response;
  Product.create(req.body, function(err, product) {
    if(err) { console.log('Error Product.create'); /* error 400 bad request */ }
    response = product;
  });
  res.json(response);
});

router.delete("/api/products/:id", (req, res) => {
  let response;
  Product.find({id: req.params.id}, function (err, product) {
    if (err) {
      console.log('Error Product.find')} 
    if (!product){
      next();//error 404 product not found
    }
    product.remove(function(err) {
      if(err) { console.log('Error Product.remove'); }
      console.log('Product deleted :')
      console.log(product)
      response = 'Product deleted'
    });
  res.json(response);
});

router.delete("/api/products", (req, res) => {
  let response;
  Product.find(function (err, product) {
    if (err) {
      console.log('Error Product.find')} 
    product.remove(function(err) {
      if(err) { console.log('Error Product.remove'); }
      console.log('Product deleted :')
      console.log(product)
      response = 'Product deleted'
    });
  res.json(response);
});

//module.exports = router;



 // var test = new Product({
 //    id: 12346,
 //    name: 'testProduct4',
 //    price: 51,
 //    image: '/assets/img/logo.svg',
 //    category: 'cameras',
 //    description: 'This is a test description.',
 //    features: ['feature1','feature2','feature3']
 //    });

 //  Product.find({id: test.id}, function (err, docs) {if (err) {console.log('Error Product.find')} }).then(result => {
 //      if (result.length < 1) {
 //        test.save().then(result => {
 //          console.log('New product save with following id :')
 //          console.log(result._id)
 //        })
 //      } else {
 //        console.log('Product already existing')
 //        console.log(result)
 //      }
 //    });

module.exports = router;
