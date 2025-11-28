// server/app.js (entry)
const connection = require("./connection/connection");
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const propertiesRouter = require("./routes/properties/properties"); // adjust path

dotenv.config();

const port = process.env.PORT || 4500;
const URL = process.env.URL || `http://localhost:${port}`;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));

// serve uploads folder statically (so /uploads/<filename> works)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// mount routes at root (no /admin)
app.use("/", propertiesRouter);

connection.connect((error) => {
  if (error) {
    console.log("failed in connection", error);
    process.exit(1);
  } else {
    console.log("database connected successfully");
    app.listen(port, () => {
      console.log(`server is running on ${URL}`);
    });
  }
});
