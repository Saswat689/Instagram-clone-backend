const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();

// IMPORT ROUTES
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use("/static", express.static(__dirname + "/uploads"));

app.use("/auth", authRoutes);
app.use("/", postRoutes);

const PORT = process.env.PORT || 8000;

// DATABASE CONNECTION
const dbUrl = "mongodb://Admin-01:KzLMZVt5orxXjpeV@cluster0-shard-00-00.u8ilw.mongodb.net:27017,cluster0-shard-00-01.u8ilw.mongodb.net:27017,cluster0-shard-00-02.u8ilw.mongodb.net:27017/ig-clone?ssl=true&replicaSet=atlas-lnj64l-shard-0&authSource=admin&retryWrites=true&w=majority"

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("ERROR IN DATABASE CONNECTION");
    console.log(err);
  });
