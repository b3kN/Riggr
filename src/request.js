// request.js
// Provides centralized control for async/xhr requests
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.Requester = factory(root.$);
  }
}(this, function ($) {

  // Returns jquery defferred for XHR request
  var request = function (reqObj) {
    // Properties
    var url = reqObj.url || false;
    var type = reqObj.type || 'GET';
    var payload = (typeof reqObj.payload === 'object') ? reqObj.payload : {};

    // Return def
    return $.ajax({
      url: url,
      type: type,
      data: payload
    });
  };

  return request;

}));
