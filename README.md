# Riggr

Set of utils for building web app's using [RequireJS](http://requirejs.org/),
[Knockout](http://knockoutjs.com/) and [jQuery](http://www.jquery.com).

## Usage

Riggr can be easily installed via `bower install riggr`. The bower package
contains all core files and dependencies. The core utilizes a small set of the
dependencies' methods, so utilizing different versions can be done by simply
changing the path in your RequireJS config.

The core idea behind Riggr is to establish a simple application scaffold by creating
a core `app` definition and component controllers and views which are associated
with routes.

This is achieved by setting basic properties in the `main.js` file, then using
the `rigg` method to build the build the application. For example:

Given the following structure:

```
js/
  require-config.js
  main.js
  controllers/
    app.js
    pages/
      one.js
      two.js
views/
  app.html
    pages/
      one.html
      two.html
```

The `js/main.js` would be similar to the following:

```javascript
require(['require-config'], function () {
  require([
    'riggr',
    'controllers/app',
  ], function (rigg, app) {
    // Set app title
    app.title = 'Example';
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
```

Then, the `js/controllers/app.js` file:

```javascript
define([
  'knockout'
], function (ko) {

  var app = {
    // Route table
    routes: {
      '/': 'pages/one',
      '/two': 'pages/two',
      // Example with parameter
      '/two/:param': 'pages/two'
    }
  };

  return app;

});
```

### Containers

There are two containers required in the DOM for loading routes. The main `app`
looks for a container element with `id="appContainer"`.

In the `app.html` view (once initialized) all additional views are loaded into
an element with `id="viewContainer"`.

From here, routing guides all other initialization operations within the application.

### Routing

All routing should be defined in `app.js`. The `app.js` file is
essentially the core controller and initializes all additional controllers. The
controllers then respond to their assigned routes with the following methods:

```javascript
define([], function () {

  var myController = {

    pageTitle: 'Foo',

    before: function (fn) {
      // Check for condition to allow route to be loaded or not...
      // then fire the fn with boolean to continue or block
      fn(true);
    },

    load: function () {
      // Do something on route/view load
      // Any params in the URL are passed as arguments
    },

    unload: function () {
      // Do something when the route/view is unloaded
    }

  };

  return myController;

});
```

Views should match the pathing of their associated controller and
automatically load on route match (and if applicable, passing of the `before`
handler).

### Knockout & Binding

When a controller is loaded, Knockout's `applyBindings` method is fired to create
a composite controller/viewmodel.

```javascript
define([
  'knockout'
], function (ko) {

  var foo = {

    bar: ko.observable();

    // ...additional properties/methods...

  };

  return foo;

});
```

The above controller/viewmodel has Knockout binding applied on load/init and the
corresponding view will respond to the `ko` objects.

```html
<span data-bind="text: bar"></span>
```

### Observer

The `{riggr-path}/observer.js` file provides basic pub/sub functionality. Controllers
using this must explicitly pass it in using `define`, then can use the following
methods:

```javascript
var mysub = observer.subscribe('example', function () {
  // Topic `example` triggered
});

observer.publish('example', [OPTIONAL_ARGUMENTS]);

observer.unsubscribe(mysub);
```

### Requests

The `{riggr-path}/request.js` file provides basic XHR functionality via jQuery. Controllers
using this must explicitly pass it in using `define`, then can call the `request`
method and attach to the returned jQuery XHR object:

```javascript
var req = request({
  url: '/some/endpoint',
  type: 'POST',
  payload: { foo: 'bar' }
});

req.done(function() { .... });

req.fail(function() { .... });
```

