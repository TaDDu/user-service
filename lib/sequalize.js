const Sequelize = require("sequelize");
const config = require(process.cwd() + "/config/config.json");
const UserModel = require("../models/user");
const MetaModel = require("../models/user_meta");
const UserSessionModel = require("../models/user_session.js");

const conn = new Sequelize(
  process.env.DB_NAME || config.DB_NAME,
  process.env.DB_USER || config.DB_USER,
  process.env.DB_PASSWORD || config.DB_PASSWORD,
  {
    host: process.env.DB_HOST || config.DB_HOST,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const User = UserModel(conn, Sequelize);
const Meta = MetaModel(conn, Sequelize);
const UserSession = UserSessionModel(conn, Sequelize);

conn.sync({ force: process.env.FORCE || false }).then(() => {
  User.hasMany(UserSession, {
    foreignKey: "userId",
    sourceKey: "id"
  });
  User.hasMany(Meta, {
    foreignKey: "entity",
    sourceKey: "id"
  });
});
module.exports = {
  User,
  UserSession,
  Meta
};
