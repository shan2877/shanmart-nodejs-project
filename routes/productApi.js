var express = require("express");
var api = express.Router();
var mongodb = require("mongodb");
var autoIncrement = require("mongodb-autoincrement");
var collection;
var url = "mongodb://localhost:27017";
var db;
mongodbClient = mongodb.MongoClient;
mongodbClient.connect(url, (err, client) => {
  if (err) {
    console.log("Error Connecting to DB");
  } else {
    db = client.db("shanmart");
    collection = db.collection("products");
  }
});

/* GET users listing. */
var getProducts = function (req, res, next) {
  console.log("Getting products");
  var result = collection.find({}).toArray((err, result) => {
    if (err) {
      res.send("error in fetching data");
    } else if (result.length) {
      res.send(result);
    } else {
      res.send("No documents");
    }
  });
  console.log(result);
};

var getProduct = function (req, res, next) {
  console.log("Getting product" + req.params.id);
  var result = collection
    .find({ id: parseInt(req.params.id) })
    .toArray((err, result) => {
      if (err) {
        res.send("error in fetching data");
      } else if (result.length) {
        res.send(result);
      } else {
        res.send("No documents");
      }
    });
  console.log(result);
};

var createProduct = function (req, res, next) {
  autoIncrement.getNextSequence(db, "shanmart", function (err, autoIndex) {
    var doc = { ...req.body, _id: autoIndex };
    collection.insertOne(doc, (err, result) => {
      if (err) {
        res.send("error in creating record");
      }
      res.send(result.ops[0]);
    });
  });
};

module.exports = { getProducts, getProduct, createProduct };
