const express = require("express");
const crypto = require("crypto");
const { Sequelize } = require("sequelize");
const { host, user, password, database } = require("../config/config");
const usersRouter = express.Router();
const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: "mysql",
});

let session;

const getUser = async (req, res, next) => {
  const { username, password } = req.body;
  const [results] = await sequelize.query(
    `select ilance_users.username, ilance_users.password, ilance_users.salt, ilance_users.email from ilance_users where username = '${username}'`
  );
  res.users = results;
  res.password = password;
  res.username = username;
  next();
};

const getHashedPw = (pw, salt) => {
  const firstHash = crypto.createHash("md5").update(pw).digest("hex");
  const secondHash = crypto
    .createHash("md5")
    .update(`${firstHash}${salt}`)
    .digest("hex");
  return secondHash;
};

usersRouter.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "Logged Out" });
});

usersRouter.post("/login", getUser, async (req, res) => {
  const { password, users } = res;
  const user = users[0];
  if (!user) return res.status(400).json({ error: "Invalid Credentials" });
  const hashedPw = getHashedPw(password, user.salt);
  if (hashedPw === user.password) {
    session = req.session;
    session.userid = user.username;
    return res.status(200).send({ message: "Login successful", session });
  } else return res.status(400).json({ error: "Invalid Credentials" });
});

usersRouter.post("/register", getUser, async (req, res) => {
  const { username, password, users } = res;
  if (users.length > 0)
    return res.status(400).json({ error: "Username already exists" });
  const salt = crypto.randomBytes(32).toString("base64").slice(0, 5);
  const hashedPw = getHashedPw(password, salt);
  const [results] = await sequelize.query(
    `insert into ilance_users (username, password, salt, styleid, languageid, currencyid, timezone,notifyservices,notifyproducts,displayprofile,emailnotify,displayfinancials,vatnumber,regnumber,dnbnumber,companyname,usecompanyname,timeonsite,daysonsite) values ('${username}', '${hashedPw}', '${salt}', '1','1','1','America/Toronto','1','1','1','1','1','1','1','1','Company Name','1','1','1')`
  );
  session = req.session;
  session.userid = username;
  return res
    .status(200)
    .json({ message: "Registration successful", session: session });
});

module.exports = usersRouter;
