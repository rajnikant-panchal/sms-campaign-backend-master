/**
 * MessageFile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var uuid = require("uuid");

module.exports = {

  tableName:'message_files',

  attributes: {
    id:{
      type:'string',
      primaryKey: true,
      unique:true
    },
    message_id:{
      model: 'Message'
    },
    file_type: {
      type:'int',  // 0=Image 1=Video 2=Audio 3=Text/PDF 4=VCard
      defaultsTo: function() { return 0; } 
    },
    file_name:{
      type:'string'
    },
    uploaded_by: {
      model: 'User'
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

