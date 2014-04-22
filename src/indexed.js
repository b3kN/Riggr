/* global: indexedDB, IDBKeyRange */
// index.js
// Provides easy interaction with indexedDB
// ---
// Part of the Riggr SPA framework <https://github.com/Fluidbyte/Riggr> and released
// under the MIT license. This notice must remain intact.
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.indexed = factory();
  }
}(this, function () {

  // Hackery
  window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

  function indexed(dbstore) {

    return {

      // Ensure callback exists and is function, then do it...
      processCB: function (cb, out) {
        if (cb && typeof cb === 'function') {
          var err = (out === false) ? true : false;
          cb(err, out);
        } else {
          console.error('Improper callback');
        }
      },

      // Parse query to string for evaluation
      parseQuery: function (query) {
        // Operands
        var operands = {
          '$gt': '>',
          '$lt': '<',
          '$gte': '>=',
          '$lte': '<=',
          '$ne': '!='
        };
        // Set key
        var key = Object.keys(query);
        // Check for conditional
        if (typeof query[Object.keys(query)] === 'object') {
          var condition = Object.keys(query[Object.keys(query)]);
          return {
            field: key[0],
            operand: operands[condition],
            value: query[key][condition]
          };
        } else {
          // Direct (==) matching
          return {
            field: key[0],
            operand: '==',
            value: query[key]
          };
        }
      },

      // Check data type
      checkType: function (obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
      },

      // Create indexedDB store
      create: function (cb) {
        var self = this;
        var request = indexedDB.open(dbstore);

        // Handle onupgradeneeded
        request.onupgradeneeded = function (e) {
          var db = e.target.result;

          if (db.objectStoreNames.contains(dbstore)) {
            var storeReq = db.deleteObjectStore(dbstore);
          }

          // Create store
          var store = db.createObjectStore(dbstore, {
            keyPath: '_id',
            autoIncrement: false
          });
        };

        request.onsuccess = function (e) {
          e.target.result.close();
          self.processCB(cb, true);
        };

        request.onerror = function () {
          self.processCB(cb, false);
        };
      },

      // Add item to the store
      insert: function (data, cb) {
        var self = this;
        var request = indexedDB.open(dbstore);
        request.onsuccess = function (e) {
          // Setup trans and store
          var db = e.target.result;
          var trans = db.transaction([dbstore], self.IDBTransactionModes.READ_WRITE);
          var store = trans.objectStore(dbstore);

          if (self.checkType(data) === 'array') {
            // Insert array of items
            var i = 0;
            var returnQuery = {
              '_id': {
                '$gte': new Date().getTime()
              }
            };
            putNext();

            function putNext() {
              if (i < data.length) {
                // Set _id
                data[i]._id = new Date().getTime() + i;
                // Insert, call putNext recursively on success
                store.put(data[i]).onsuccess = putNext;
                console.log('data', data[i]);
                i++;
              } else {
                // Complete
                self.find(returnQuery, cb);
              }
            }

          } else {
            // Insert single item
            data._id = new Date().getTime();
            var request = store.put(data).onsuccess = function (e) {
              // Run select to return new record
              self.find({
                _id: data._id
              }, cb);
              db.close();
            };

            // Insert error
            request.onerror = function (e) {
              self.processCB(cb, false);
            };
          }
        };

        // General error
        request.onerror = function () {
          self.processCB(cb, false);
        };
      },

      // Traverse data
      traverse: function (query, data, cb) {
        var self = this;
        var request = indexedDB.open(dbstore);

        request.onsuccess = function (e) {

          var db = e.target.result;
          var trans = db.transaction([dbstore], self.IDBTransactionModes.READ_WRITE);
          var store = trans.objectStore(dbstore);

          // Setup cursor request
          var keyRange = IDBKeyRange.lowerBound(0);
          var cursorRequest = store.openCursor(keyRange);
          var results = [];

          cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            // Stop on no result
            if ( !! result === false) {
              return;
            }
            // Test query
            if (query) {
              var match = result.value[query.field];
              var value = query.value;
              var test = 'match' + query.operand + 'value';
              // Evaluate test condition
              if (eval(test)) {
                // Check if update
                if (self.checkType(data) === 'object') {
                  for (var prop in data) {
                    result.value[prop] = data[prop];
                  }
                  result.update(result.value);
                }
                // Check if delete
                if (data === 'delete') {
                  result.delete(result.value._id);
                }
                // Push to array
                results.push(result.value);
              }
            } else {
              // Check if update
              if (self.checkType(data) === 'object') {
                for (prop in data) {
                  result.value[prop] = data[prop];
                }
                result.update(result.value);
              }
              // Check if delete
              if (data === 'delete') {
                result.delete(result.value._id);
              }
              // Push to array
              results.push(result.value);
            }
            // Move on
            result.
            continue ();
          };

          // Entire transaction complete
          trans.oncomplete = function (e) {
            // Send results
            self.processCB(cb, results);
            db.close();
          };

          // Cursor error
          cursorRequest.onerror = function () {
            self.processCB(cb, false);
          };
        };

        // General error, cb false
        request.onerror = function () {
          self.processCB(cb, false);
        };

      },

      // Find record(s)
      find: function () {
        var query = false;
        var cb;
        // Check arguments to determine query
        if (arguments.length === 1 && typeof arguments[0] === 'function') {
          // Find all
          cb = arguments[0];
        } else {
          // Conditional find
          query = this.parseQuery(arguments[0]);
          cb = arguments[1];
        }
        this.traverse(query, false, cb);
      },

      // Update record(s)
      update: function () {
        var query = false;
        var data;
        var cb;
        // Check arguments to determine query
        if (arguments.length === 2 && typeof arguments[1] === 'function') {
          // Update all
          data = arguments[0];
          cb = arguments[1];
        } else {
          // Update on match
          query = this.parseQuery(arguments[0]);
          data = arguments[1];
          cb = arguments[2];
        }
        this.traverse(query, data, cb);
      },

      // Delete record(s)
      delete: function () {
        var query = false;
        var cb;
        // Check arguments to determine query
        if (arguments.length === 1 && typeof arguments[0] === 'function') {
          // Find all
          cb = arguments[0];
        } else {
          // Conditional find
          query = this.parseQuery(arguments[0]);
          cb = arguments[1];
        }
        this.traverse(query, 'delete', cb);
      },

      // Drop data store
      drop: function (cb) {
        var self = this;
        var deleteRequest = indexedDB.deleteDatabase(dbstore);
        // Golden
        deleteRequest.onsuccess = function (e) {
          self.processCB(cb, true);
          self.create();
        };
        // Blocked
        deleteRequest.onblocked = function (e) {
          self.processCB(cb, false);
        };
        // Something worse
        deleteRequest.onerror = function () {
          self.processCB(cb, false);
        };
      },

      IDBTransactionModes: {
        'READ_ONLY': 'readonly',
        'READ_WRITE': 'readwrite',
        'VERSION_CHANGE': 'versionchange'
      }

    };

  }

  return indexed;

}));
