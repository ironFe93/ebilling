
const user = require('../models/user');

//auth and security
var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'nancy';
/* jwtOptions.issuer = 'accounts.examplesoft.com';
jwtOptions.audience = 'yoursite.net'; */

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  user.findById(jwt_payload.id, function(err, res){
    if (err) console.log(err);

    if (res) {
      done(null, res);
    } else {
      done(null, false);
    }
  });
});

passport.use(strategy);

module.exports = passport;
