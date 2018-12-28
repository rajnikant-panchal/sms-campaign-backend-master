module.exports.orderappResponse = function(code, msg, data) {
  var response_obj = {
    code: code,
    msg: msg,
    data: data
  };

  return response_obj;
};
