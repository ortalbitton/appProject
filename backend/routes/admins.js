const express = require("express");
const multer = require("multer");

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


router.get("", (req, res, next) => {
  const adminQuery = Admin.find();

  let fetchedAdmins;

  adminQuery
    .then(documents => {
      fetchedAdmins = documents;
      return Admin.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Admins fetched successfully!",
        admins: fetchedAdmins,
        maxAdmins: count
      });
    });
});

router.post(
  "",
  multer({
    storage: storage
  }).single("image"),
  (req, res, next) => {

    const admin = new Admin({
      name: req.body.name
    });

    admin.save().then(createdAdmin => {
      res.status(201).json({
        message: "Admin added successfully",
        admin: {
          ...createdAdmin,
          id: createdAdmin._id,
        }
      });
    });

  }
);


module.exports = router;
