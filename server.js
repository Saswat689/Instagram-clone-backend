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
const dbUrl = process.env.DB_URL

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
