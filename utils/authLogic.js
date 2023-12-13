const run = require("../config/mongodb");

async function checkRBAC(req, allowedRoles) {
  const { coll, client } = run("shop", "Users");
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic "))
      throw new Error("Credentials are not correct");

    const credentials = Buffer.from(
      authHeader.substring("Basic ".length),
      "base64"
    ).toString("utf-8");
    const [name, password] = credentials.split(":");
    console.warn("credentials logic -> ", name, password);

    const user = await coll.findOne({ name, password });

    return user && allowedRoles.includes(user.role);
  } finally {
    await client.close();
  }
}

module.exports = { checkRBAC };
