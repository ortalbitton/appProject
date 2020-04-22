const mongoose = require("mongoose");

const advertisementSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  openingHours: {
    type: String,
    required: true
  },
  closingHours: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  admindBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});


module.exports = mongoose.model("Advertisement", advertisementSchema);
