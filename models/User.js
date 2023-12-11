const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.DB_MONGO2);

exports.createSchema = async () => {
  try {
    const db = client.db("shop");

    const collections = await db.listCollections().toArray();
    let collExists = false;

    collections.forEach((coll) => {
      if (coll.name === "Users") collExists = true;
    });

    if (!collExists) {
      const schema = {
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
        username: {
          type: "string",
        },
        role: {
          type: "string",
        },
      };

      await db.createCollection("Users", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: Object.keys(schema),
            properties: {
              ...schema,
            },
          },
        },
      });
    }

    await db.collection("Users").createIndex({ email: 1 }, { unique: true });
    await db.collection("Users").createIndex({ username: 1 }, { unique: true });
  } catch (error) {
    console.error(
      "Error while creating schema through mongoDB driver -> \n",
      error
    );
  } finally {
    await client.close();
  }
};
