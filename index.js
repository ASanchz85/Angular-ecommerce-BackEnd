const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const User = require("./models/User");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/auth", require("./routes/user.routes"));
app.use("/img", express.static(path.join(__dirname, "img")));

connectDB();
User.createSchema();

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
