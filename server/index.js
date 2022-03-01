require("dotenv").config();
const path = require('path')
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const recordsRouter = require("./routes/records");
const usersRouter = require("./routes/users");
const mysql = require("mysql2");
const config = require("./config/config");
const connection = mysql.createConnection(config);
const session = require("express-session");
const oneDay = 1000 * 60 * 60 * 24;

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: "mysql",
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

(async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error(error);
  }
})();

connection.connect(() => console.log(`Connected to database...`));

app.use("/records", recordsRouter);
app.use("/users", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port : ${PORT}`));
