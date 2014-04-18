define([
  'knockout'
], function (ko) {

  var app = {

    // Test observable
    timestamp: ko.observable(+new Date()),

    // Route table
    // Format: {route}: {path/to/controller}
    routes: {
      '/': 'pages/one',
      '/two': 'pages/two',
      '/two/:param': 'pages/two',
      //
      '/404': '404'
    },
    
    // Run when app is loaded
    load: function () {
      console.log('APP LOADED');
    },

    // On route loaded/changed
    onRoute: function () {
      // Set timestamp observable
      this.timestamp(+new Date());
    }
  };

  return app;

});