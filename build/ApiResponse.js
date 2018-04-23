'use strict';

/**
 * @callback mapperCallback
 *
 * @type {function(AxiosResponse): {results: Array, total?: Number, count?: Number}}
 */

/**
 * Generic response wrapper. Makes working with responses safer, since all fields are guaranteed to be
 * present and always named the same.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiResponse = function () {
  _createClass(ApiResponse, null, [{
    key: '_defaultMapper',


    /**
     * Holds the default field mapper for responses
     *
     * @return {mapperCallback}
     * @private
     */
    get: function get() {
      return function (response) {
        return response.data;
      };
    }

    /**
     * Creates a new response object
     *
     * @param {AxiosResponse}  axiosResponse
     * @param {mapperCallback} [mapResults]
     */

  }]);

  function ApiResponse(axiosResponse) {
    var mapResults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ApiResponse._defaultMapper;

    _classCallCheck(this, ApiResponse);

    /**
     * Holds the response data, provided with all default fields
     *
     * @type {Object}
     * @private
     */
    this._data = mapResults(axiosResponse);
    this._status = axiosResponse.status;
    this._headers = axiosResponse.headers;
    this._request = axiosResponse.request;
    this._response = axiosResponse;
    this._url = axiosResponse.request.responseURL;

    /**
     * Whether the response has been served from cache
     *
     * @type {boolean}
     */
    this.fromCache = false;
  }

  /**
   * Retrieves the raw response data
   *
   * @return {Object}
   */


  _createClass(ApiResponse, [{
    key: 'data',
    get: function get() {
      return this._data;
    }

    /**
     * Retrieves the total number of matching items. Returns -1 if there is no total property.
     *
     * @return {Number}
     */

  }, {
    key: 'total',
    get: function get() {
      return this.data.total || -1;
    }

    /**
     * Retrieves the number of results
     *
     * @return {Number}
     */

  }, {
    key: 'count',
    get: function get() {
      return this.data.count || this.results.length;
    }

    /**
     * Retrieves the result data
     *
     * @return {Array}
     */

  }, {
    key: 'results',
    get: function get() {
      return Array.isArray(this.data.results) ? this.data.results : [this.data.results];
    }

    /**
     * Retrieves the first result
     *
     * @return {*}
     */

  }, {
    key: 'first',
    get: function get() {
      return this.results[0];
    }

    /**
     * Retrieves the last result
     *
     * @return {*}
     */

  }, {
    key: 'last',
    get: function get() {
      return this.results[this.total - 1];
    }

    /**
     * Retrieves the response status code
     *
     * @return {Number}
     */

  }, {
    key: 'statusCode',
    get: function get() {
      return this._status || 0;
    }

    /**
     * Retrieves all request headers
     *
     * @return {Object}
     */

  }, {
    key: 'headers',
    get: function get() {
      return this._headers || {};
    }

    /**
     * Retrieves the original request object
     *
     * @return {XMLHttpRequest}
     */

  }, {
    key: 'request',
    get: function get() {
      return this._request;
    }

    /**
     * Retrieves the original response object
     *
     * @return {AxiosResponse}
     */

  }, {
    key: 'response',
    get: function get() {
      return this._response;
    }
  }, {
    key: 'url',
    get: function get() {
      return this._url;
    }
  }]);

  return ApiResponse;
}();

exports.default = ApiResponse;