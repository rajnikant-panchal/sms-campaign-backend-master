/**
 * CreditLedgerController
 *
 * @description :: Server-side logic for managing Creditledgers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getMyBalance: function(req, res) {
    var session_user = req.session.user;
    CreditLedgerService.getUserBalance(session_user.id)
    .then((response) => {
      return res.ok({ status: 'SUCCESS' , balance: response.balance });
    })
    .catch((err) => {
      return res.serverError(customResponse.orderappResponse("ERROR", "Error fetching balance", err));
    });
  },

  getUserBalance: function(req, res) {
    var session_user = req.session.user;
    if(session_user.user_type!=0) {
      return res.forbidden(customResponse.orderappResponse("ERROR", "You are not authorized to see other users balance", {}));
    }
    else {
      var user_id = req.query.user_id;
      CreditLedgerService.getUserBalance(user_id)
      .then((response) => {
        return res.ok({ status: 'SUCCESS' , balance: response.balance });
      })
      .catch((err) => {
        return res.serverError(customResponse.orderappResponse("ERROR", "Error fetching balance", err));
      });
    }
  },

  rechargeCredit: function(req, res) {
    var session_user = req.session.user;
    var creditObj = req.body;
    if(session_user.user_type!=0) {
      return res.forbidden(customResponse.orderappResponse("ERROR", "You are not authorized to recharge balance", {}));
    }
    else {
      var finalObj = {
        user_id: creditObj.user_id,
        amount: Math.abs(creditObj.amount),
        transaction_done_by: session_user.id,
        transaction_code: 'RECHARGE',
      };
      CreditLedger.create(finalObj)
      .then((response) => {
        return res.ok({ status: 'SUCCESS' , data: response });
      })
      .catch((err) => {
        return res.serverError(customResponse.orderappResponse("ERROR", "Error in performing recharge", err));
      });
    }
  }

};

