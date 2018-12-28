/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
  createMessage: function(req, res) {
    const messageObj = req.body;
    var session_user = req.session.user;
    messageObj.user_id = session_user.id;
    var tempMessageId = '';
    CreditLedgerService.getUserBalance(session_user.id)
    .then((balanceObj) => {
      if(balanceObj.balance<messageObj.phone_numbers.split(',').length) {
        throw 'INSUFFICIENT_BALANCE';
      }
      else {
        return Message.create(messageObj);
      }
    })
    .then((response) => {
      tempMessageId = response.id;
      if(messageObj.fileArr && messageObj.fileArr.constructor===Array) {
        let fileIds = [];
        messageObj.fileArr.forEach((fileObj) => {
          fileIds.push(fileObj.id);
        });
        return MessageFile.update({id: fileIds}, {message_id: response.id});
      }
      else {
        throw 'SUCCESS';
      }
    })
    .then((updatedResult) => {
      const objLedger = {
        user_id: session_user.id,
        amount: -(messageObj.phone_numbers.split(',').length),
        message_id: tempMessageId,
        transaction_code: 'SMS_DEBIT',
        transaction_done_by: session_user.id,
      };
      return CreditLedger.create(objLedger);
    })
    .then((ledgerSaved) => {
      return res.ok(customResponse.orderappResponse("SUCCESS", "Message saved successfully", ledgerSaved));
    })
    .catch((err) => {
      if(err=='SUCCESS') {
        const objLedger = {
          user_id: session_user.id,
          amount: -(messageObj.phone_numbers.split(',').length),
          message_id: tempMessageId,
          transaction_code: 'SMS_DEBIT',
          transaction_done_by: session_user.id,
        };
        CreditLedger.create(objLedger)
        .then((ledgerSaved) => {
          return res.ok(customResponse.orderappResponse("SUCCESS", "Message saved successfully", {}));
        })
        .catch((err) => {
          return res.ok(customResponse.orderappResponse("SUCCESS", "Message saved successfully", {}));
        })
      }
      else if(err=='INSUFFICIENT_BALANCE') {
        return res.serverError(customResponse.orderappResponse("ERROR", "Insufficient Balance. Please recharge", err));
      }
      else {
        return res.serverError(customResponse.orderappResponse("ERROR", "Error adding message", err));
      }
    });
  },

  getMyMessages: function(req, res) {
    var page = req.query.page;
    var limit = parseInt(req.query.limit);
    var session_user = req.session.user;
    var where_clause = { delflag: 0 };
    if(session_user.user_type!=0) {
      where_clause.user_id = session_user.id;
    }
    if(page) {
      page = parseInt(page);
    }
    else {
      page = 1;
    }

    Message.pagify('messages', {
      findQuery: where_clause,
      sort: ['createdAt DESC'],
      page: page,
      populate: ['message_files', 'vcard_id', 'user_id'],
      perPage: limit || 10
    })
    .then(function(response) {
      return res.ok(customResponse.orderappResponse("SUCCESS", "Messages fetched successfully", response));
    })
    .catch(function(err) {
      return res.serverError(customResponse.orderappResponse("FAILURE", "Failed to fetch Messages", err));
    });
  }

};

