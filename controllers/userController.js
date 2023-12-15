const run = require("../config/mongodb");

async function createUser(req, res) {
  const { coll, client } = run("shop", "Users");

  try {
    const query = await coll.insertOne(req.body);

    if (query.acknowledged)
      res.status(201).json({ msg: "user successfully created", success: true });
    else
      res.status(403).json({ msg: "user couldnt be created", success: false });

    console.log("insert -> ", query.acknowledged);
  } catch (error) {
    switch (error.code) {
      case 11000:
        res
          .status(400)
          .json({ msg: "The user has already existed", success: false });

        console.warn(
          "error while inserting through mongo driver -> statusCode: ",
          res.statusCode
        );
        break;
      case 121:
        res
          .status(400)
          .json({ msg: "There are missing fields", success: false });

        console.warn(
          "error while inserting through mongo driver -> statusCode: ",
          res.statusCode
        );
        break;
      default:
        res.status(501).json(error);

        console.error(
          "error while inserting through mongo driver -> statusCode: ",
          res.statusCode
        );
        break;
    }
  } finally {
    await client.close();
  }
}

async function findUserByEmail(req, res) {
  const { coll, client } = run("shop", "Users");

  try {
    const query = await coll.findOne(
      { email: req.body.email },
      { projection: { _id: 0 } }
    );

    if (query && query.password === req.body.password)
      res
        .status(202)
        .json({ msg: "user successfully identified", success: true, query });
    else
      res.status(404).json({
        msg: "user couldn't be found, email or password incorrect",
        success: false,
        originalRequest: req.body
      });

    console.log("findByEmail -> ", query);
  } catch (error) {
    res.status(500).json(error);

    console.error(
      "error while retrieving info of the user through mongo driver -> statusCode: ",
      res.statusCode
    );
  } finally {
    await client.close();
  }
}

async function findUserByName(req, res) {
  const { coll, client } = run("shop", "Users");

  try {
    const query = await coll.findOne(
      { username: req.body.username },
      { projection: { _id: 0 } }
    );

    if (query && query.password === req.body.password)
      res
        .status(202)
        .json({ msg: "user successfully identified", success: true, query });
    else
      res.status(404).json({
        msg: "user couldn't be found, name or password incorrect",
        success: false,
        originalRequest: req.body
      });

    console.log("findByName -> ", query);
  } catch (error) {
    res.status(500).json(error);

    console.error(
      "error while retrieving info of the user through mongo driver -> statusCode: ",
      res.statusCode
    );
  } finally {
    await client.close();
  }
}

module.exports = { createUser, findUserByEmail, findUserByName };
