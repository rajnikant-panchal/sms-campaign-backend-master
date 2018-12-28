/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcryptjs');
var uuid = require('node-uuid');

module.exports = {

  tableName:'users',

  attributes: {
    id:{
      type:'string',
      primaryKey: true,
      unique:true
    },
    fullname:{
      type:'string'
    },
    username:{
      type:'string'
    },
    password:{
      type:'string'
    },
    mobile: {
      type: 'string'
    },
    user_rights:{
      type:'string'
    },
    user_type: {
      type: 'integer',  // 0 = Admin 1 = Karigar
      defaultsTo: function() {
        return 0;
      }
    },
    delflag: {
      type: 'integer',
      defaultsTo: function() {
        return 0;
      }
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  beforeCreate: function(user, cb) {
    user.id = uuid.v4();
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          cb(err);
        } else {
          user.password = hash;
          cb();
        }
      });
    });
  }
};


