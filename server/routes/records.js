const express = require("express");
const { Sequelize } = require("sequelize");
const { host, user, password, database } = require("../config/config");
const recordsRouter = express.Router();
const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: "mysql",
});

const baseQuery =
  "SELECT ilance_projects.date_added, ilance_projects.project_id, ilance_projects.project_title, ilance_users.username, ilance_categories.category FROM ilance_users inner join ilance_projects on ilance_projects.user_id = ilance_users.user_id join ilance_categories on ilance_projects.cid = ilance_categories.cid";

recordsRouter.get("/sortBy/:sortBy/order/:order", async (req, res) => {
  const { sortBy, order } = req.params;
  let { page, limit } = req.query;
  const lim = parseInt(limit);
  if (!page || page < 1) page = 1;
  const params = ["username", "category", "date_added", "project_title"];
  if (
    !params.some((param) => sortBy.includes(param)) ||
    !order.match(/asc|desc/i)
  ) {
    return res.status(400).json({ error: "Invalid params" });
  }
  const [results] = await sequelize.query(
    `${baseQuery} order by ${sortBy} ${order}`
  );
  if (results.length <= (page - 1) * lim)
    page = Math.ceil(results.length / lim);
  return res.status(200).json({
    records: results.slice((page - 1) * lim, (page - 1) * lim + lim),
    count: Math.ceil(results.length / lim),
  });
});

module.exports = recordsRouter;
