/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var jwt = require('jwt-simple');
var bcrypt = require("bcryptjs");

module.exports = {
  
  login: function(req, res) {
    var user_obj = req.body;
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({
      username: username
    })
    .then(function(response) {
      if(response) {
        //USER FOUND
        var found_password = response.password;
        bcrypt.compare(password, found_password, function(err, passwords_match) {
          if(passwords_match) {
            // Add user to session
            var token = jwt.encode(response, sails.config.session.secret);
            response.token = token;
            return res.ok(customResponse.orderappResponse("SUCCESS", "User logged in successfully", response));
          }
          else {
            // Invalid password
            return res.forbidden(customResponse.orderappResponse("FAILURE", "User credentials invalid", err));
          }
        });
      }
      else {
        //USER DOESNT EXIST
        return res.forbidden(customResponse.orderappResponse("FAILURE", "User not found", {}));
      }
    })
    .catch(function(error) {
      return res.serverError(customResponse.orderappResponse("FAILURE", "Server error occured", error));
    });
  }

};

