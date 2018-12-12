var exports = (module.exports = {});
var _ = require("lodash");
var unirest = require("unirest");
var jwt = require("jsonwebtoken");
const config = require(process.cwd() + "/config/config.json");
const { User, UserSession, Meta } = require("../sequalize.js");

exports.get = {
  me: (req, res) => {
    if (req.user) {
      User.findOne({
        where: { id: req.user.id },
        include: [{ model: Meta }]
      }).then(user => {
        if (user == null) {
          res.status(404).json({ error: true, message: "User not found" });
        } else {
          user = user.get();
          var newMeta = {};
          user.meta.map(m => {
            newMeta[m.key] = m.value;
          });
          user.meta = newMeta;
          res.status(200).json(user);
        }
      });
    } else {
      res.status(404).json({ error: true, message: "User not found" });
    }
  },
  meta: (req, res) => {
    Meta.findAll({ where: { entity: req.user.id } }).then(meta => {
      res.json(meta);
    });
  }
};

exports.post = {
  meta: (req, res) => {
    let body = _.pick(req.body, ["meta"]);
    if (Array.isArray(body)) {
    } else {
      var key = Object.keys(body.meta);
      key = key[0];
      var value = body.meta[key];
      Meta.findOrCreate({
        where: { entity: req.user.id, key: key },
        defaults: { entity: req.user.id, key: key, value: value }
      }).spread((meta, created) => {
        if (created) {
          res.status(201).json(meta);
        } else {
          meta.update({ value: body.meta[key] }).then(newMeta => {
            res.status(201).json(newMeta);
          });
        }
      });
    }
  }
};
