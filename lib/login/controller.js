var exports = (module.exports = {});
var _ = require("lodash");
var unirest = require("unirest");
var jwt = require("jsonwebtoken");
const config = require(process.cwd() + "/config/config.json");
const { User, UserSession } = require("../sequalize.js");

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
            var claims = {
              userId: user.id,
              domains: []
            };
            var token = CreateJWT(claims);
            if (created) {
              // USER CREATED NO NEED TO FETCH DOMAINS
              // Create session
              var session = UserSession.build({
                userId: user.id,
                accessToken: token
              })
                .save()
                .then(ses => {
                  res.json({ jwt: token });
                });
            } else {
              // USER FOUND
              GetDomains(token)
                .then(domains => {
                  var d = [];
                  if (domains.length > 0) {
                    domains.map(domain => {
                      d.push(domain.domain.id);
                    });
                  }

                  claims.domains = d;
                  var token = CreateJWT(claims);
                  res.json({ jwt: token });
                  /*
                var session = UserSession.build({
                  userId: user.id,
                  accessToken: token
                })
                  .save()
                  .then(ses => {
                    res.json({ jwt: token });
                  });
                  */
                })
                .catch(error => {
                  console.log(error);
                });
            }

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

var CreateJWT = data => {
  var token = jwt.sign(data, process.env.SECRET || config.SECRET, {
    expiresIn: "7d",
    issuer: "TMe"
  });
  return token;
};

var GetDomains = data => {
  return new Promise((resolve, reject) => {
    var url = process.env.API_GATEWAY || config.API_GATEWAY;
    unirest
      .get("http://" + url + "/api/domains")
      .headers({
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + data
      })
      .end(
        response => {
          if (response.status == 200) {
            resolve(response.body);
          } else {
            reject({
              error: true,
              message: "Error loading user domains",
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
          console.log(response.status);
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
