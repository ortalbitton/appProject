const express = require("express");
const multer = require("multer");

const Note = require("../models/note");

const User = require("../models/user");

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
    let fetched;

    const findQ = User.find({
      name: req.body.admindBy
    });

    findQ
      .then(documents => {

        fetched = documents;

        const advertisement = new Note({
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
            message: "Note added successfully",
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
    const note = new Note({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      openingHours: req.body.openingHours,
      closingHours: req.body.closingHours,
      location: req.body.location
    });
    console.log(note);
    Note.updateOne({
      _id: req.params.id
    }, note).then(result => {
      res.status(200).json({
        message: "Update successful!"
      });
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const noteQuery = Note.find().populate("admindBy", "-_id -__v");
  const groupbyQuery = Note.aggregate([{
    $group: {
      _id: "$location",
      count: {
        $sum: 1
      }
    }
  }]);

  let groupbyNotes;
  let fetchedNotes;
  if (pageSize && currentPage) {
    noteQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  groupbyQuery
    .then(documents => {
      groupbyNotes = documents;
    });

  noteQuery
    .then(documents => {
      fetchedNotes = documents;
      return Note.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Notes fetched successfully!",
        notes: fetchedNotes,
        locations: groupbyNotes,
        maxNotes: count
      });
    });
});

router.get("/:id", (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({
        message: "Note not found!"
      });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Note.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Note deleted!"
    });
  });
});

module.exports = router;
