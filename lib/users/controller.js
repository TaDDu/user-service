var exports = (module.exports = {});
var _ = require("lodash");
var unirest = require("unirest");
var jwt = require("jsonwebtoken");
const config = require(process.cwd() + "/config/config.json");
const { User, UserSession } = require("../sequalize.js");

exports.get = {
  me: (req, res) => {
    var token = req.headers["authorization"];
    token = token.split(" ");
    if (token[0] == "Bearer") {
      jwt.verify(token[1], process.env.SECRET || config.SECRET, function(
        err,
        decoded
      ) {
        if (err) {
          res.status(400).json({ error: true, message: "Not authorized" });
        } else {
          User.findOne({ where: { id: decoded.userId } }).then(user => {
            res.status(200).json(user);
          });
        }
      });
    } else {
      res.status(400).json({ error: true, message: "No authorization header" });
    }
  }
};

exports.post = {
  GoogleAuth: (req, res) => {
    var data = _.pick(req.body, [
      "email",
      "firstName",
      "lastName",
      "googleId",
      "accessToken"
    ]);
    // auth user from google server
    GoogleVerify(data.accessToken)
      .then(google => {
        // check match for googleId:user_id
        if (google.user_id == data.googleId) {
          // find or create users
          User.findOrCreate({
            where: { external_type: "GOOGLE", external_id: data.googleId },
            defaults: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              external_type: "GOOGLE",
              external_id: data.googleId
            }
          }).spread((user, created) => {
            if (created) {
              // USER CREATED
            } else {
              // USER FOUND
            }
            var token = jwt.sign(
              { userId: user.id },
              process.env.SECRET || config.SECRET,
              {
                expiresIn: "7d",
                issuer: "TMe"
              }
            );
            // Create session
            var session = UserSession.build({
              userId: user.id,
              accessToken: token
            })
              .save()
              .then(ses => {
                res.json({ jwt: token });
              });
            // return session
          });
        } else {
          res.json({ error: true, message: "Auth failed" });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(400).json(error);
      });
  }
};

var GoogleVerify = accessToken => {
  return new Promise((resolve, reject) => {
    unirest
      .get(
        "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" +
          accessToken
      )
      .headers({
        Accept: "application/json",
        "Content-Type": "application/json"
      })
      .end(
        response => {
          if (response.status == 200) {
            resolve(response.body);
          } else {
            reject({
              error: true,
              message: "Google auth error",
              data: response.body
            });
          }
        },
        error => {
          console.log(error);
        }
      );
  });
};
