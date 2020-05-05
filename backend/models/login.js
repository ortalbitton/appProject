const mongoose = require("mongoose");

const loginSchema = mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  }
});

module.exports = mongoose.model('Login', loginSchema);
