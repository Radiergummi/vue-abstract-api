'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ApiResponse = require('./ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Endpoints represent an API endpoint, working on a base URL. Endpoints are required to provide the
 * functionality for the API methods themselves, receiving only a base set of HTTP wrappers.
 */
var Endpoint = function () {
  _createClass(Endpoint, null, [{
    key: 'cachable',


    /**
     * Whether this endpoint can be cached. This can be overwritten by children endpoints to control
     * cache behaviour.
     *
     * @return {boolean}
     */
    get: function get() {
      return false;
    }

    /**
     * Holds the default endpoint parameters. These should be overridden to match your preference. Key names don't
     * reflect your actual parameter names but rather the names defined below
     * @see parameterNames
     *
     * @return {{paginate: boolean, limit: number, offset: number, orderDirection: string, multipleOrderColumns: boolean}}
     */

  }, {
    key: 'defaultParameters',
    get: function get() {
      return {
        paginate: true,
        limit: 10,
        offset: 0,
        orderDirection: 'ASC',
        multipleOrderColumns: false
      };
    }

    /**
     * Holds the default names for commonly used parameters. These should be overridden to match your application,
     * if necessary. These names are defined here because vue-abstract-api provides some special functionality like
     * chaining request conditions or pagination, all of which rely on globally known parameter names.
     * It can also help to have uniform names across different endpoints (limit will always be limit, no matter if
     * its "limit_customers" or "max_results" for some resources).
     *
     * @returns {{limit: string, offset: string, orderDirection: string, orderColumn: string, multipleOrderColumns: string, filterColumns: string}}
     */

  }, {
    key: 'parameterNames',
    get: function get() {
      return {
        limit: 'limit',
        offset: 'offset',
        orderDirection: 'direction',
        orderColumn: 'order_column',
        multipleOrderColumns: 'order_columns',
        filterColumns: 'filter_columns'
      };
    }

    /**
     * Default results mapper. Accepts an AxiosResponse, returns an object with three properties:
     *  - results: Holds the request results
     *  - count: Holds the number of results. Optional.
     *  - total: Holds the total number of entities on the server. Optional.
     *
     * @returns {function(AxiosResponse): { results: *, count?: Number, total?: Number}}
     */

  }, {
    key: 'mapResults',
    get: function get() {
      return function (response) {
        return {
          results: Array.from(response.data)
        };
      };
    }

    /**
     * Default filter mapper. Accepts a filter list, returns a comma-separated, key=value assignment string.
     * This should be overridden if required, just make sure to return a string.
     *
     * @returns {function(filters: Object): string}
     */

  }, {
    key: 'mapFilters',
    get: function get() {
      return function (filters) {
        return Object.entries(filters).map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              field = _ref2[0],
              value = _ref2[1];

          return field + ':' + value;
        }).join(',');
      };
    }

    /**
     * Default filter mapper. Accepts a filter list, returns a comma-separated, key=value assignment string.
     * This should be overridden if required, just make sure to return a string.
     *
     * @returns {function(filters: Object): string}
     */

  }, {
    key: 'mapOrders',
    get: function get() {
      return function (orders) {
        return Object.entries(orders).map(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              field = _ref4[0],
              direction = _ref4[1];

          return field + ':' + direction;
        }).join(',');
      };
    }

    /**
     * Creates a new endpoint
     */

  }]);

  function Endpoint() {
    _classCallCheck(this, Endpoint);

    /**
     * Holds the Api instance
     *
     * @type {Api}
     */
    this.api = null;

    /**
     * Holds the endpoint name
     *
     * @type {String}
     */
    this.name = this.constructor.name.toLowerCase();

    // check if this endpoint can be cached
    if (this.constructor.cachable) {

      /**
       * Holds the endpoint cache
       *
       * @type {Map}
       */
      this.cache = new Map();
    }
  }

  /**
   * mounts the endpoint on an API instance
   *
   * @param {Api} api
   *
   * @throws {TypeError} if the URL can't be constructed
   */


  _createClass(Endpoint, [{
    key: 'mount',
    value: function mount(api) {
      this.api = api;
    }
  }, {
    key: 'flushCache',


    /**
     * Flushes the endpoint cache. To remove a single entry from the cache, its path can be passed as
     * a string. Otherwise, all cached items will be cleared.
     *
     * TODO: To be actually useful, some measure to determine new resources needs to be implemented.
     *
     * @param {String} [path] path to flush. Will clear the entire cache, if omitted.
     */
    value: function flushCache() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (this.constructor.cachable) {
        if (path) {
          this.cache.delete(path);
        } else {
          this.cache.clear();
        }
      }
    }

    /**
     * Performs a GET request. If the endpoint is marked as cachable, we try to serve the request from
     * the cache. That way, near-instant and even offline requests are possible.
     *
     * @param   {String}               path    path to the resource
     * @param   {Object}               options request options
     * @param   {*}                    args    arguments to the adapter method
     * @returns {Promise<ApiResponse>}         response promise
     */

  }, {
    key: 'get',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(path, options) {
        var _api$http2;

        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        var _api$http, cacheUrl, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _ref6, _ref7, name, value, _response, response;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.constructor.cachable) {
                  _context.next = 33;
                  break;
                }

                cacheUrl = new URL(path, this.api.baseUrl);
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 5;


                for (_iterator = Object.entries(options.params)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  _ref6 = _step.value;
                  _ref7 = _slicedToArray(_ref6, 2);
                  name = _ref7[0];
                  value = _ref7[1];

                  cacheUrl.searchParams.append(name, value);
                }

                _context.next = 13;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](5);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 13:
                _context.prev = 13;
                _context.prev = 14;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 16:
                _context.prev = 16;

                if (!_didIteratorError) {
                  _context.next = 19;
                  break;
                }

                throw _iteratorError;

              case 19:
                return _context.finish(16);

              case 20:
                return _context.finish(13);

              case 21:
                if (!this.cache.has(cacheUrl.toString())) {
                  _context.next = 25;
                  break;
                }

                _response = this.cache.get(cacheUrl.toString());


                _response.fromCache = true;

                return _context.abrupt('return', _response);

              case 25:
                _context.t1 = _ApiResponse2.default;
                _context.next = 28;
                return (_api$http = this.api.http).get.apply(_api$http, [path, options].concat(args));

              case 28:
                _context.t2 = _context.sent;
                _context.t3 = this.constructor.mapResults;
                response = new _context.t1(_context.t2, _context.t3);


                // cache the response
                this.cache.set(response.url, response);

                return _context.abrupt('return', response);

              case 33:
                _context.t4 = _ApiResponse2.default;
                _context.next = 36;
                return (_api$http2 = this.api.http).get.apply(_api$http2, [path, options].concat(args));

              case 36:
                _context.t5 = _context.sent;
                _context.t6 = this.constructor.mapResults;
                return _context.abrupt('return', new _context.t4(_context.t5, _context.t6));

              case 39:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 9, 13, 21], [14,, 16, 20]]);
      }));

      function get(_x2, _x3) {
        return _ref5.apply(this, arguments);
      }

      return get;
    }()

    /**
     * Performs a DELETE request.
     *
     * @param  {String}        path path to the resource
     * @param  {*}             args arguments to the adapter method
     * @return {Promise<*>}         response promise
     */

  }, {
    key: 'delete',
    value: function _delete(path) {
      var _api$http3;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return (_api$http3 = this.api.http).delete.apply(_api$http3, [path].concat(args));
    }

    /**
     * Performs a POST request.
     *
     * @param  {String}        path path to the resource
     * @param  {Object}        data request body data
     * @param  {*}             args arguments to the adapter method
     * @return {Promise<*>}         response promise
     */

  }, {
    key: 'post',
    value: function post(path, data) {
      var _api$http4;

      for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
      }

      return (_api$http4 = this.api.http).post.apply(_api$http4, [path, data].concat(args));
    }

    /**
     * Performs a PUT request.
     *
     * @param  {String}        path path to the resource
     * @param  {Object}        data request body data
     * @param  {*}             args arguments to the adapter method
     * @return {Promise<*>}         response promise
     */

  }, {
    key: 'put',
    value: function put(path, data) {
      var _api$http5;

      for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        args[_key4 - 2] = arguments[_key4];
      }

      return (_api$http5 = this.api.http).put.apply(_api$http5, [path, data].concat(args));
    }

    /**
     * Performs a PATCH request.
     *
     * @param  {String}        path path to the resource
     * @param  {Object}        data request body data
     * @param  {*}             args arguments to the adapter method
     * @return {Promise<*>}         response promise
     */

  }, {
    key: 'patch',
    value: function patch(path, data) {
      var _api$http6;

      for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        args[_key5 - 2] = arguments[_key5];
      }

      return (_api$http6 = this.api.http).patch.apply(_api$http6, [path, data].concat(args));
    }
  }, {
    key: 'defaultParameters',
    get: function get() {
      return this.constructor.defaultParameters;
    }
  }, {
    key: 'parameterNames',
    get: function get() {
      return this.constructor.parameterNames;
    }
  }]);

  return Endpoint;
}();

/**
 * @type {Endpoint}
 */


exports.default = Endpoint;