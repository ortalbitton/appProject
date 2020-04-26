const express = require("express");
const multer = require("multer");

const Advertisement = require("../models/advertisement");

const Admin = require("../models/admin");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  multer({
    storage: storage
  }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");

    const findQ = Admin.find({
      name: req.body.admindBy
    });

    findQ
      .then(documents => {

        fetched = documents;

        const advertisement = new Advertisement({
          title: req.body.title,
          content: req.body.content,
          imagePath: url + "/images/" + req.file.filename,
          openingHours: req.body.openingHours,
          closingHours: req.body.closingHours,
          location: req.body.location,
          admindBy: fetched[0]._id
        });

        advertisement.save().then(createdNote => {
          res.status(201).json({
            message: "Advertisement added successfully",
            advertisement: {
              ...createdNote,
              id: createdNote._id,
            }
          });
        });
      });
  }
);

router.put(
  "/:id",
  multer({
    storage: storage
  }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const findQ = Admin.find({
      name: req.body.admindBy
    });

    findQ
      .then(documents => {

        fetched = documents;

        const advertisement = new Advertisement({
          _id: req.body.id,
          title: req.body.title,
          content: req.body.content,
          imagePath: imagePath,
          openingHours: req.body.openingHours,
          closingHours: req.body.closingHours,
          location: req.body.location,
          admindBy: fetched[0]._id
        });
        console.log(advertisement);
        Advertisement.updateOne({
          _id: req.params.id
        }, advertisement).then(result => {
          console.log(advertisement);
          res.status(200).json({
            message: "Update successful!"
          });
        });
      });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const advertisementQuery = Advertisement.find().populate("admindBy", "-__v");
  const groupbyQuery = Advertisement.aggregate([{
    $group: {
      _id: "$location",
      count: {
        $sum: 1
      }
    }
  }]);

  let groupbyNotes;
  let fetchedAdvertisements;
  if (pageSize && currentPage) {
    advertisementQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  groupbyQuery
    .then(documents => {
      groupbyNotes = documents;
    });

  advertisementQuery
    .then(documents => {
      fetchedAdvertisements = documents;
      return Advertisement.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Advertisements fetched successfully!",
        advertisements: fetchedAdvertisements,
        locations: groupbyNotes,
        maxNotes: count
      });
    });
});

router.get("/:id", (req, res, next) => {
  Advertisement.findById(req.params.id).populate("admindBy", "-__v").then(advertisement => {
    if (advertisement) {
      res.status(200).json(advertisement);
    } else {
      res.status(404).json({
        message: "Advertisement not found!"
      });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Advertisement.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Advertisement deleted!"
    });
  });
});

module.exports = router;
