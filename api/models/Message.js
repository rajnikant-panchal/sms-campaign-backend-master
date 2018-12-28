/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require("uuid");

module.exports = {

  tableName:'messages',

  attributes: {
    id:{
      type:'string',
      primaryKey: true,
      unique:true
    },
    user_id:{
      model: 'User'
    },
    vcard_id: {
      model: 'Vcard'
    },
    message_text:{
      type: 'string',
    },
    phone_numbers:{
      type: 'string', //Comma separated numbers
    },
    message_files: {
      collection: 'MessageFile',
      via: 'message_id',
    },
    lat:{
      type: 'string', //Lat
    },
    lng:{
      type: 'string', //Lng
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

