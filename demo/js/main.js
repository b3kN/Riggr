require(['require-config'], function () {
  require([
    'riggr',
    'controllers/app',
  ], function (rigg, app) {
    
    // Set app title
    app.title = 'Demo';
    // Set view transition
    app.transition = 150;
    // Set paths
    app.paths = {
      controllers: 'controllers',
      views: '../views'
    };
    // Initialize app
    rigg(app);
    
  });
});
