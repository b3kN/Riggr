// store.js
// Provides easy interaction with localStorage
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.store = factory();
  }
}(this, function () {

  var store = {

    // Check type of data
    checkType: function (obj) {
      return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    },

    // Set item
    set: function (name, data) {
      // Check if object
      if (this.checkType(data) === 'object' || this.checkType(data) === 'array') {
        // Stringify contents
        data = JSON.stringify(data);
      }
      // Set in lS
      localStorage.setItem(name, data);
    },

    // Get (and parse) item
    get: function (name) {
      var data;
      try {
        // If this is JSON, parse it
        data = JSON.parse(localStorage.getItem(name));
      } catch (e) {
        // Just send back the string
        data = localStorage.getItem(name);
      }
      // Send it back
      return data;
    },

    // Remove item
    remove: function (name) {
      localStorage.removeItem(name);
    }

  };

  return store;

}));
