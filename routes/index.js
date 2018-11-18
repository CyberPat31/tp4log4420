const express = require("express");
const router = express.Router();

/* GET index page */
router.get("/", (req, res) => {
  res.render("index", { title: "Accueil", message: "Ça semble fonctionner!" });
});

/* GET index page */
router.get("/accueil", (req, res) => {
  res.render("index", { title: "Accueil", message: "Ça semble fonctionner!" });
});

/* GET produits page */
router.get('/products', function(req, res) {
  var mongoose = req.db;
  var Products = mongoose.model('Product').schema;
  Products.find({},{},function(e,docs){
    res.json(docs);
  });
});
/*router.get('/produits', function(req, res) {
	res.render("products", { title: "Produits", message: "Page des produits" });
});*/

/* GET produit page */
/*router.get("/produits/:id", (req, res) => {
  res.render("index", { title: "Accueil", message: "Ça semble fonctionner!" });
});*/

/* GET contact page */
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact", message: "Page des contacts" });
});

/* GET panier page */
router.get("/panier", (req, res) => {
  res.render("shopping-cart", { title: "Panier d'achat", message: "Page du panier d'achat" });
});

/* GET commande page */
router.get("/commande", (req, res) => {
  res.render("order", { title: "Commande", message: "Page des commandes" });
});

/* GET confirmation page */
router.get("/confirmation", (req, res) => {
  res.render("confirmation", { title: "Confirmation", message: "Page de confirmation" });
});

module.exports = router;
