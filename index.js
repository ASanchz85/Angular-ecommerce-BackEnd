const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({limit: '2mb'}));
app.use("/api/products", require("./routes/product"));

connectDB();

app.get("/", (req, res) => {
  console.log("get request received!!");
  res.send("<h1>Running correctly</h1>");
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
