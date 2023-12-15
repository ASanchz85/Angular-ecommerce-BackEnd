const run = require("../config/mongodb");

async function checkRBAC(req, allowedRoles) {
  const { coll, client } = run("shop", "Users");
  try {
    const authHeader = req.headers.authorization;
    console.log("authHeader: ", authHeader);
    if (!authHeader || !authHeader.startsWith("Basic "))
      throw new Error("Credentials are not correct");

    const credentials = Buffer.from(
      authHeader.substring("Basic ".length),
      "base64"
    ).toString("utf-8");
    const [username, password] = credentials.split(":");
    console.warn("credentials decoding -> ", username, password);

    const user = await coll.findOne({ username, password });
    console.log("user find - MongoDB -> ", user);

    return user && allowedRoles.includes(user.role);
  } finally {
    await client.close();
  }
}

module.exports = { checkRBAC };
