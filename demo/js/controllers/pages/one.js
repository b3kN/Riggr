define([
  'knockout'
], function (ko) {

  var one = {

    pageTitle: 'One',

    // Check before loading route
    // Not required, just an example:
    before: function (fn) {
      console.log('Before One');
      fn(true); // ...or fn(false) to block access
    },
    
    // Any onload processes
    load: function () {
      console.log('Loaded One');
    },
    
    // Run when leaving page
    // Not required, just an example
    unload: function () {
      console.log('Unloaded One');
    }
    
  };

  return one;

});