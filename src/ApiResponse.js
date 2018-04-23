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
class ApiResponse {

  /**
   * Holds the default field mapper for responses
   *
   * @return {mapperCallback}
   * @private
   */
  static get _defaultMapper () {
    return response => response.data;
  }

  /**
   * Creates a new response object
   *
   * @param {AxiosResponse}  axiosResponse
   * @param {mapperCallback} [mapResults]
   */
  constructor ( axiosResponse, mapResults = ApiResponse._defaultMapper ) {

    /**
     * Holds the response data, provided with all default fields
     *
     * @type {Object}
     * @private
     */
    this._data = mapResults( axiosResponse );
    this._status    = axiosResponse.status;
    this._headers   = axiosResponse.headers;
    this._request   = axiosResponse.request;
    this._response  = axiosResponse;
    this._url       = axiosResponse.request.responseURL;

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
  get data () {
    return this._data;
  }

  /**
   * Retrieves the total number of matching items. Returns -1 if there is no total property.
   *
   * @return {Number}
   */
  get total () {
    return this.data.total || -1;
  }

  /**
   * Retrieves the number of results
   *
   * @return {Number}
   */
  get count () {
    return this.data.count || this.results.length;
  }

  /**
   * Retrieves the result data
   *
   * @return {Array}
   */
  get results () {
    return Array.isArray( this.data.results ) ? this.data.results : [ this.data.results ];
  }

  /**
   * Retrieves the first result
   *
   * @return {*}
   */
  get first () {
    return this.results[ 0 ];
  }

  /**
   * Retrieves the last result
   *
   * @return {*}
   */
  get last () {
    return this.results[ this.total - 1 ];
  }

  /**
   * Retrieves the response status code
   *
   * @return {Number}
   */
  get statusCode () {
    return this._status || 0;
  }

  /**
   * Retrieves all request headers
   *
   * @return {Object}
   */
  get headers () {
    return this._headers || {};
  }

  /**
   * Retrieves the original request object
   *
   * @return {XMLHttpRequest}
   */
  get request () {
    return this._request;
  }

  /**
   * Retrieves the original response object
   *
   * @return {AxiosResponse}
   */
  get response () {
    return this._response;
  }

  get url () {
    return this._url;
  }
}

export default ApiResponse;
