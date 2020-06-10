var express = require("express");
var router = express.Router();
var mongodb = require("mongodb");

/* GET users listing. */
router.get("/", function (req, res, next) {
  mongodbClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017";

  mongodbClient.connect(url, (err, client) => {
    if (err) {
      console.log("Error Connecting to DB");
    } else {
      var db = client.db("shanmart");
      var collection = db.collection("products");
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
    }
  });
});

module.exports = router;
