const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const advertisementsRoutes = require("./routes/advertisements");
const usersRoutes = require("./routes/users");

const app = express();

/*mongoose
  .connect(
    "mongodb+srv://max:QuBqs0T45GDKPlIG@cluster0-ntrwp.mongodb.net/node-angular?retryWrites=true"
  )*/
mongoose.connect('mongodb://localhost:27017/myapp')
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
//app.use("/images", express.static(path.join("backend/images")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/advertisements", advertisementsRoutes);
app.use("/api/users", usersRoutes);



app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", index.html));
});


module.exports = app;
