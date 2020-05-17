const express = require("express");

const mapReduce = require("../models/mapReduce");

const router = express.Router();


router.get("", (req, res, next) => {
  const titleQuery = mapReduce.find();

  let titles;

  titleQuery
    .then(documents => {
      titles = documents;
      return mapReduce.count();
    })
    .then(count => {
      res.status(200).json({
        message: "mapReduce is successfully!",
        titles: titles,
        maxTitles: count
      });
    });
});

module.exports = router;
