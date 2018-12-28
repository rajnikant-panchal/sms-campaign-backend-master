/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Token policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
  if(req.headers.authorization) {
    var user;
    var token = req.headers.authorization;
    try {
      user = jwt.decode(token, sails.config.session.secret);
    } catch (e) {

    }
    if(!user) {
      return res.forbidden(customResponse.orderappResponse("INVALID_TOKEN", "Token is invalid", {}));
    }
    else {
      console.log("isauthenticated - user - ", user);
      req.session.user = user;
      next();
    }
  }
  else {
    return res.forbidden(customResponse.orderappResponse("NO_AUTHORIZATION", "No token found for authorization", {}));
  }

};
