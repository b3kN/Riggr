define([
  'knockout'
], function (ko) {

  var two = {

    pageTitle: 'Two',

    // Test observable
    param: ko.observable(),

    // Check before loading route
    // Not required, just an example:
    before: function (fn) {
      console.log('Before Two');
      fn(true); // ...or fn(false) to block access
    },

    // Any onload processes
    load: function (param) {
      if (param !== undefined) {
        // Set `param` observable
        this.param(param);
      } else {
        // Clear `param` observable
        this.param(false);
      }
      console.log('Loaded Two');
    },

    // Run when leaving page
    // Not required, just an example
    unload: function () {
      console.log('Unloaded Two');
    }

  };

  return two;

});