/**
 * Vcard.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require("uuid");

module.exports = {

  tableName:'vcards',

  attributes: {
    id:{
      type:'string',
      primaryKey: true,
      unique:true
    },
    title: {
      type: 'string'
    },
    full_name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    website: {
      type: 'string'
    },
    phone: {
      type: 'string'
    },
    delflag: {
      type:'int',  // 0=Not Deleted 1=Deleted
      defaultsTo: function() { return 0; } 
    },
  },

  beforeCreate: function (values, cb) {
    values.id = uuid.v4();
    cb();
  },

};
