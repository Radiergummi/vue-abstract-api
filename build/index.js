'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Api = require('./Api');

var _Api2 = _interopRequireDefault(_Api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    // check for the headers option, default it
    if (!options.hasOwnProperty('headers')) {
      options.headers = {};
    }

    // check for the interceptors option, default it
    if (!options.hasOwnProperty('interceptors')) {
      options.interceptors = {
        request: [],
        response: []
      };
    } else {
      if (!options.interceptors.hasOwnProperty('request')) {
        options.interceptors.request = {};
      }

      if (!options.interceptors.hasOwnProperty('response')) {
        options.interceptors.response = {};
      }
    }

    if (!options.hasOwnProperty('endpoints')) {
      options.endpoints = [];
    }

    /**
     * Attaches the API to the Vue prototype
     *
     * @type {Api}
     */
    Vue.prototype.$api = new _Api2.default(options.baseUrl, options);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = options.endpoints[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var EndpointClass = _step.value;

        Vue.prototype.$api.mount(new EndpointClass());
      }

      /**
       * Attaches the HTTP adapter to the Vue prototype to perform custom requests
       *
       * @type {AxiosInstance}
       */
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

    Vue.prototype.$http = Vue.prototype.$api.http;
  }
};