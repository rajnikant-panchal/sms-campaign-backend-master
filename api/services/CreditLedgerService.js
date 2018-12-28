var request = require('request');
var q = require('q');

module.exports = {
  
  getUserBalance: function(user_id) {
    var defer = q.defer();
    CreditLedger.query('SELECT SUM(cl.amount) AS balance FROM credit_ledger AS cl WHERE cl.delflag=0 AND cl.user_id="'+user_id+'" GROUP BY cl.user_id', function(err, result) {
      if(err) {
        defer.reject(err);
      }
      if(result && result.constructor===Array && result.length>0) {
        defer.resolve({ balance: result[0].balance });
      }
      else {
        defer.resolve({ balance: 0 });
      }
    });
    return defer.promise;
  },

};