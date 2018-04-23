'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Endpoint2 = require('./Endpoint');

var _Endpoint3 = _interopRequireDefault(_Endpoint2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Generic abstraction to represent a CRUD resource. Resources can be fetched, created, updated and
 * destroyed. Additionally, they provide some convenience methods and can be configured using the
 * same static getters available from the Endpoint object.
 *
 * @property {String}      path
 * @property {AxiosStatic} http
 */
var Resource = function (_Endpoint) {
  _inherits(Resource, _Endpoint);

  function Resource() {
    _classCallCheck(this, Resource);

    var _this = _possibleConstructorReturn(this, (Resource.__proto__ || Object.getPrototypeOf(Resource)).call(this));

    _this._activeOptions = {
      parameters: {}
    };
    return _this;
  }

  /**
   * Default path. Should be overwritten in children resources
   *
   * @returns {String}
   */


  _createClass(Resource, [{
    key: 'index',


    /**
     * Fetches all entities
     *
     * @param   {Object} [options]
     *
     * @returns {Promise<ApiResponse>}
     */
    value: function index() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


      // merge endpoint defaults with specific options
      var mergedOptions = Object.assign({}, this.constructor.defaultParameters, this._activeOptions, options);
      var requestOptions = {
        params: Object.assign({}, this._activeOptions.parameters, options.parameters)
      };

      if (mergedOptions.paginate) {
        requestOptions.params[this.constructor.parameterNames.limit] = mergedOptions.limit;
        requestOptions.params[this.constructor.parameterNames.offset] = mergedOptions.offset;
      }

      if (mergedOptions.orderColumn) {
        requestOptions.params[this.constructor.parameterNames.orderColumn] = mergedOptions.orderColumn;
        requestOptions.params[this.constructor.parameterNames.orderDirection] = mergedOptions.orderDirection;
      }

      if (mergedOptions.orderColumns) {
        var orderColumns = Object.entries(mergedOptions.orderColumns);

        if (orderColumns.length === 1) {
          requestOptions.params[this.constructor.parameterNames.orderColumn] = orderColumns[0][0];
          requestOptions.params[this.constructor.parameterNames.orderDirection] = orderColumns[0][1];
        } else {
          requestOptions.params[this.constructor.parameterNames.orderColumns] = this.constructor.mapOrders(mergedOptions.orderColumns);
        }
      }

      if (mergedOptions.filterColumns) {
        requestOptions.params[this.parameterNames.filterColumns] = this.constructor.mapFilters(mergedOptions.filterColumns);
      }

      // reset all active options after building the request options
      this._resetOptions();

      // noinspection JSCheckFunctionSignatures
      return this.get(this.path, requestOptions);
    }

    /**
     * Fetches all entities
     *
     * @param   {Object}         [options]
     * @returns {Promise<Array>}
     */

  }, {
    key: 'all',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.index(options);

              case 2:
                response = _context.sent;
                return _context.abrupt('return', response.results);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function all() {
        return _ref.apply(this, arguments);
      }

      return all;
    }()

    /**
     * Fetches a single entity
     *
     * @param   {Number}     id
     * @param   {Object}     [options]
     * @returns {Promise<*>}
     */

  }, {
    key: 'one',
    value: function one(id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.get(this.path + '/' + id, options).then(function (response) {
        return response.first;
      });
    }

    /**
     * Creates a new entity
     *
     * @param   {Object}     data
     * @param   {Object}     [options]
     * @returns {Promise<*>}
     */

  }, {
    key: 'create',
    value: function create(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.post(this.path, data, options);
    }

    /**
     * Updates an entity
     *
     * @param   {Number}     id
     * @param   {Object}     data
     * @param   {Object}     [options]
     * @returns {Promise<*>}
     */

  }, {
    key: 'update',
    value: function update(id, data) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.put(this.path + '/' + id, data, options);
    }

    /**
     * Destroys an existing entity
     *
     * @param   {Number}     id
     * @param   {Object}     [options]
     * @returns {Promise<*>}
     */

  }, {
    key: 'destroy',
    value: function destroy(id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.delete(this.path + '/' + id, options);
    }

    /**
     * Resets the chain options
     *
     * @private
     */

  }, {
    key: '_resetOptions',
    value: function _resetOptions() {
      this._activeOptions = {};
    }
  }, {
    key: 'paginate',
    value: function paginate() {
      var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.defaultParameters.limit;
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultParameters.offset;

      this._activeOptions.paginate = true;
      this._activeOptions.limit = limit;
      this._activeOptions.offset = offset;

      return this;
    }
  }, {
    key: 'orderBy',
    value: function orderBy(field) {
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultParameters.direction;

      if (!this._activeOptions.hasOwnProperty('orderColumns')) {
        this._activeOptions.orderColumns = {};
      }

      this._activeOptions.orderColumns[field] = direction;

      return this;
    }
  }, {
    key: 'filterBy',
    value: function filterBy(field, value) {

      // if the parameter is explicitly disabled, we'll assume there is no such param and any filters
      // should just be appended as ordinary URL parameters.
      if (this.constructor.parameterNames.filterColumns === null) {
        this._activeOptions.parameters[field] = value;
      } else {
        if (!this._activeOptions.hasOwnProperty('filterColumns')) {
          this._activeOptions.filterColumns = {};
        }

        this._activeOptions.filterColumns[field] = value;
      }

      return this;
    }
  }, {
    key: 'path',


    /**
     * Retrieves the endpoint path from the static property
     *
     * @returns {String}
     */
    get: function get() {
      return this.constructor.path;
    }
  }], [{
    key: 'path',
    get: function get() {
      return '/' + this.name.toLowerCase();
    }
  }]);

  return Resource;
}(_Endpoint3.default);

exports.default = Resource;