const { MongoClient } = require("mongodb");
require("dotenv").config();

module.exports = function run(databaseName, collection) {
  const client = new MongoClient(process.env.DB_MONGO2);
  console.log("DB connected successfully - MongoDB");
  const db = client.db(databaseName);
  const coll = db.collection(collection);
  return { coll, client };
};
