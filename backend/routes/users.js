const express = require("express");
const multer = require("multer");

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
    const user = new User({
      name: req.body.name,
      password: req.body.password
    });

    user.save().then(createdNote => {
      res.status(201).json({
        message: "User added successfully",
        user: {
          ...createdNote,
          id: createdNote._id
        }
      });
    });
  }
);

router.get("", (req, res, next) => {
  const userQuery = User.find();

  let fetchedUsers;

  userQuery
    .then(documents => {
      fetchedUsers = documents;
      //return Note.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Users fetched successfully!",
        users: fetchedUsers,
        maxUsers: count
      });
    });
});

router.delete("/:id", (req, res, next) => {
  User.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    res.status(200).json({
      message: "User deleted!"
    });
  });
});


module.exports = router;
