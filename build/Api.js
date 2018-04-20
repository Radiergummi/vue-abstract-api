'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _Endpoint = require('./Endpoint');

var _Endpoint2 = _interopRequireDefault(_Endpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * API base class
 * Provides an entry point to the API abstraction. Basically, Api revolves around the concept of endpoints.
 * An endpoint, in code terms, represents the respective HTTP endpoint of the remote API. It provides
 * methods for all available functionality on the remote endpoint but abstracts away the actual HTTP
 * communication. This makes it possible to define remote URIs in one place instead of being scattered
 * across the application, enables testing by mocking the remote API and provides ways to modify requests
 * and responses transparently.
 */
var Api = function () {
  _createClass(Api, null, [{
    key: 'type',


    /**
     * Content type for all requests and responses. This is statically fixed to JSON. Should the data type
     * ever change (to XML for example), this must be modified according to the new data MIME type.
     *
     * @return {string}
     */
    get: function get() {
      return 'application/json';
    }

    /**
     * Retrieves the HTTP backend adapter responsible for handling the actual AJAX operations. There are a
     * couple of hard-coded function calls specific to axios, though most modern client-side HTTP clients
     * should provide mostly the same feature set.
     * Additionally, the prototype is required for some setup work.
     *
     * @return {AxiosStatic}
     */

  }, {
    key: 'adapter',
    get: function get() {
      return _axios2.default;
    }

    /**
     * Creates a new API base class
     *
     * @param {String} baseUrl
     * @param {Object} options
     */

  }]);

  function Api() {
    var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Api);

    /**
     * API base URL
     *
     * @type {String}
     */
    this.baseUrl = baseUrl;

    /**
     * Default request headers. All requests should provide the API data type and the requested with header
     * for compatibility reasons, so these are non-overridable, too.
     *
     * @type {Object}
     */
    this.headers = Object.assign({}, options.headers, {
      'Content-Type': this.constructor.type,
      'X-Requested-With': 'XMLHttpRequest'
    });

    this.authentication = options.authentication;

    /**
     * HTTP client instance
     *
     * @type {AxiosInstance}
     */
    this.http = this.constructor.adapter.create({
      baseURL: this.baseUrl,
      headers: this.headers,
      auth: this.authentication
    });

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = options.interceptors.request[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var interceptor = _step.value;

        this.http.interceptors.request.use(interceptor);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = options.interceptors.response[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _interceptor = _step2.value;

        this.http.interceptors.response.use(_interceptor);
      }

      // create a set for the endpoints to be mounted
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    this.endpoints = new Set();
  }

  /**
   * Mounts an endpoint by attaching it to the API class instance
   *
   * @param {Endpoint} endpoint
   *
   * @throws {TypeError} If the endpoint is no Endpoint instance
   * @throws {Error} If the endpoint exists or an invalid property is used
   */


  _createClass(Api, [{
    key: 'mount',
    value: function mount(endpoint) {

      // check if this is a valid endpoint
      if (!(endpoint instanceof _Endpoint2.default)) {
        throw new TypeError('Can only add Endpoint instances as endpoints');
      }

      // check if this endpoint is registered already
      if (this.endpoints.has(endpoint.name)) {
        throw new Error('Mount point ' + endpoint.name + ' is already taken');
      }

      // Check whether the endpoint name exists as a method or property of this class, already
      if (Object.getOwnPropertyNames(this.constructor.prototype).includes(endpoint.name)) {
        throw new Error('Can not assign endpoints to internal property ' + endpoint.name);
      }

      // call the endpoint mount
      endpoint.mount(this);

      // add the endpoint to the endpoints list
      this.endpoints.add(endpoint);

      // add the endpoint to the instance
      this[endpoint.name] = endpoint;
    }
  }]);

  return Api;
}();

exports.default = Api;