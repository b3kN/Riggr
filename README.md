# Riggr

Set of utils for building web app's using [RequireJS](http://requirejs.org/),
[Knockout](http://knockoutjs.com/) and [jQuery](http://www.jquery.com).

## Usage

Riggr can be easily installed via `bower install riggr`. The bower package
contains all core files and dependencies. The core utilizes a small set of the
dependencies' methods, so utilizing different versions can be done by simply
changing the path in your RequireJS config.

The core idea behind Riggr is to establish a simple application structure by creating
a core `app` definition and component controllers and views which are associated
with routes.

This is achieved by setting basic properties in the `main.js` file, then using
the `rigg` method to build the application. For example:

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
index.html
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

Then, in the `js/controllers/app.js` file:

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

The `app` file can contain other methods and properties used throughout the application.

### Containers

There are two containers required in the DOM for loading routes. The main `app`
looks for a container element  in `index.html` with `id="appContainer"`.

In the `app.html` view (once initialized) all additional views are loaded into
an element with `id="viewContainer"`.

From here, routing guides all other initialization operations within the application.

### Routing

Routes defined in `app` are monitored by the router for a match. When matched/called the
controllers respond to their assigned routes with the following methods:

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
automatically load on route match (and if applicable, after passing of the `before`
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

The `{riggr-path}/request.js` file provides AJAX/XHR request management. Controllers
using this must explicitly pass it in using `define`, then can call the `request`
methods and attach to the returned jQuery XHR object.

Requests use jQuery's `$.ajax()` method but allow for storing and managing common
requests.

#### Example of a standard call:

```javascript
var req = request.send({
  url: '/some/endpoint',
  type: 'POST',
  data: { foo: 'bar' }
});

req.done(function() { .... });

req.fail(function() { .... });
```

#### Using the storage capabilites:

```javascript
// Create a stored request
request.create('myReq', {
  url: '/some/endpoint/',
  type: 'GET'
});

// Calling a stored request
request.send('myReq')
  .done(function () {
    // ...
  })
  .fail(function () {
    // ...
  });

// Removing a stored request
request.remove('myReq');
```

#### Providing call parameters:

The `request` object allows for the overriding of default/pre-defined properties
of the stored request with run-time properties:

```javascript
// Create request
request.create('myReq', {
  url: '/some/endpoint/'
});

// Calling stored request with parameter overrides
request.send('myReq', { type: 'POST', data: { name: 'Foo' }})
  .done(function () {
    // ...
  })
  .fail(function () {
    // ...
  });
```

#### URL Parameters

The `request` object allows for creating dynamic URL parameters through the
`url_params` property:

```javascript
// Create request
request.create('myReq', {
  url: '/some/endpoint/{id}/',
  type: 'GET'
});

// Call request and replace {id} param in URL
request.send('myReq', { url_params: { id: '383729282' }})
  .done(function () {
    // ...
  })
  .fail(function () {
    // ...
  });
```

### Store

The `{riggr-path}/store.js` file provides localStorage management. Controllers
using this must explicitly pass it in using `define`, then can access the methods
provided:

#### Set

When setting, the `store.set` method will determine data type and parse the data
for storage

```javascript
// Set a string value
store.set('myStoreString', 'foo');

// Set an object or array (data is stringified for storage)
store.set('myStoreObj', { foo: 'bar' });
```

#### Get

When retrieving (getting) an item, the `store.get` method will parse the data to
return the original type:

```javascript
// Returns the origin object from the set example above
store.get('myStoreObj');
```

#### Remove

Using `store.remove` will clear an item from localStorage:

```javascript
// Removes the item and it's data
store.remove('myStoreObj');
```

## License

Riggr is released under the MIT license and as such is completely free to use,
modify and redistribute.

