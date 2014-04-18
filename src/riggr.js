// composer.js
// Builds core application methods, binds routes, and loads init from app.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['router', 'observer', 'knockout', 'jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('router'), require('observer'), require('knockout'), require('jquery'));
  } else {
    root.riggr = factory(root.router, root.observer, root.ko, root.$);
  }
}(this, function (router, observer, ko) {

  // Base vars, defaults
  var count = 0;
  var loaded = 0;
  var appTitle = false;
  var transition = 0;
  var controllers = [];
  var paths = {
    controllers: 'controllers',
    views: 'views'
  };
  var appContainer = 'appContainer';
  var viewContainer = 'viewContainer';

  // Sets title
  var setTitle = function (pageTitle) {
    // Both app and page title
    if (appTitle && pageTitle) {
      document.title = pageTitle + ' | ' + appTitle;
    }
    // App title only
    if (appTitle && !pageTitle) {
      document.title = appTitle;
    }
    // Page title only
    if (!appTitle && pageTitle) {
      document.title = pageTitle;
    }
  };

  // Build load handler
  var loadView = function (view, controller, args, load) {
    var el = document.getElementById(viewContainer);
    // Transition-out
    $(el).fadeOut(transition, function () {
      // Set html
      $(el).html(view);
      // Bind it up
      ko.cleanNode(el);
      ko.applyBindings(controller, el);
      // Process transition-in
      $(this).fadeIn(transition);
    });
    if (load) {
      controller.load.apply(controller, args);
    }
    // Publish onRoute
    observer.publish('onRoute');
    // Set page title
    if (controller.hasOwnProperty('pageTitle')) {
      setTitle(controller.pageTitle);
    } else {
      setTitle(false);
    }
  };

  // Builds route handlers and dom render handlers
  var build = function (route, path) {

    require([paths.controllers + '/' + path], function (controller) {

      controllers.push(controller);

      var routeHandler = {};

      // Create before handler
      if (controller.hasOwnProperty('before')) {
        routeHandler.before = controller.before.bind(controller);
      }

      // Create load handler
      if (controller.hasOwnProperty('load')) {
        routeHandler.load = function () {
          var args = arguments;
          require(['text!' + paths.views + '/' + path + '.html'], function (view) {
            loadView(view, controller, args, true);
          });
        };
      } else {
        routeHandler.load = function () {
          require(['text!' + paths.views + '/' + path + '.html'], function (view) {
            loadView(view, controller, [], false);
          });
        };
      }

      // Create unload handler
      if (controller.hasOwnProperty('unload')) {
        routeHandler.unload = controller.unload.bind(controller);
      }

      // Create route
      router.on(route, routeHandler);

      // Increment loaded tracker
      loaded++;

      // On last route, process...
      if (count === loaded) {
        loadApp();
      }

    });
  };

  // Load the main app controller and view
  var loadApp = function () {
    require([paths.controllers + '/app', 'text!' + paths.views + '/app.html'], function (app, appView) {
      // Load view into main
      $('#' + appContainer).html(appView);
      // Apply app bindings
      ko.applyBindings(app);
      // Listen for route change
      observer.subscribe('onRoute', function () {
        app.onRoute.apply(app);
      });
      // Check for 'load'
      if (app.hasOwnProperty('load')) {
        app.load.apply(app);
      }
      // Process routes
      router.process();
    });
  };

  // Loops through and loads routes, sets app properties
  var rigg = function (app) {
    // Get size
    Object.size = function (obj) {
      var size = 0,
        key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          size++;
        }
      }
      return size;
    };

    // Check for paths overrides
    if (app.hasOwnProperty('paths')) {
      paths = app.paths;
    }

    // Set title
    appTitle = (app.hasOwnProperty('title')) ? app.title : false;
    setTitle('Loading');

    // Set transition
    transition = (app.hasOwnProperty('transition')) ? app.transition : 0;

    // Set count
    count = Object.size(app.routes);

    // Build controller+route handlers
    for (var route in app.routes) {
      build(route, app.routes[route]);
    }
  };

  return rigg;

}));
