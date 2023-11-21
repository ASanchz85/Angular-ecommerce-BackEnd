const mongoose = require("mongoose");
//!! mirar dotenv a nivel encriptación -> If DOTENV_KEY is present, it smartly attempts to load encrypted .env.vault file contents into process.env.
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("error while trying to connect to mongoDB: ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
