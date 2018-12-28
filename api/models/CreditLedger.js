/**
 * CreditLedger.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require("uuid");

module.exports = {

  tableName:'credit_ledger',

  attributes: {
    id:{
      type:'string',
      primaryKey: true,
      unique:true
    },
    user_id:{
      model: 'User'
    },
    message_id:{
      model: 'Message'
    },
    amount: {
      type: 'integer'
    },
    transaction_done_by:{
      model: 'User'
    },
    delflag:{
      type: 'integer', //Comma separated numbers
      defaultsTo: function(){ return 0; }
    },
    transaction_code:{
      type: 'string'
    },
  },

  beforeCreate: function (values, cb) {
    values.id = uuid.v4();
    cb();
  },

};