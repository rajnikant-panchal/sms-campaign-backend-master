/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	saveUser: function(req, res) {
    var user_data = req.body;
    User.findOne({username: user_data.username, delflag: 0})
    .then(function(duplicate) {
      if(!user_data.id && duplicate) {
        throw "USERNAME_TAKEN";
      }
      else if(user_data.id && duplicate && duplicate.id!==user_data.id) {
        throw "USERNAME_TAKEN";
      }
      else {
        if(user_data.id) {
          // Edit
          return User.update({id: user_data.id}, user_data);
        }
        else {
          return User.create(user_data);
        }
      }
    })
    .then(function(user) {
      return res.ok(customResponse.orderappResponse("SUCCESS", "User saved successfully", user));
    })
    .catch(function(err) {
      if(err==="USERNAME_TAKEN") {
        return res.badRequest(customResponse.orderappResponse("FAILURE", "The username is already taken by other user. Please use another username", err));
      }
      else {
        return res.serverError(customResponse.orderappResponse("FAILURE", "Server error occured", err));
      }
    });
  },

  getUsers: function(req, res) {
    var page = req.query.page;
    var limit = parseInt(req.query.limit);
    // var limit = req.query.limit;
    var fullname = req.query.fullname;
    var username = req.query.username;
    var user_type = req.query.user_type;
    var mobile = req.query.mobile;

    var where_clause = {delflag: 0};

    if(fullname) {
      where_clause.fullname = {
        like: '%'+fullname+'%'
      };
    }

    if(username) {
      where_clause.username = {
        like: '%'+username+'%'
      };
    }

    if(mobile) {
      where_clause.mobile = {
        like: '%'+mobile+'%'
      };
    }

    if(user_type) {
      where_clause.user_type = user_type;
    }

    if(page) {
      page = parseInt(page);
    }
    else {
      page = 1;
    }

    User.pagify('users', {
      findQuery: where_clause,
      sort: ['fullname DESC'],
      page: page,
      perPage: limit || 10
    })
    .then(function(response) {
      return res.ok(customResponse.orderappResponse("SUCCESS", "Users fetched successfully", response));
    })
    .catch(function(err) {
      return res.serverError(customResponse.orderappResponse("FAILURE", "Failed to fetch Users", err));
    });

  },

  deleteUser: function(req, res) {
    var id = req.query.id;
    User.update({id: id}, {delflag: 1})
    .then(function(response) {
      return res.ok(customResponse.orderappResponse("SUCCESS", "User deleted successfully", response));
    })
    .catch(function(err) {
      return res.serverError(customResponse.orderappResponse("FAILURE", "Failed to delete User", err));
    });
  }

};

