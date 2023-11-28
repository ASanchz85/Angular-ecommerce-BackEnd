const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/api/products", require("./routes/product"));
app.use("/img", express.static(path.join(__dirname, "img")));

connectDB();

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
