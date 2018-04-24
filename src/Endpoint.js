'use strict';

import ApiResponse from './ApiResponse';

/**
 * Endpoints represent an API endpoint, working on a base URL. Endpoints are required to provide the
 * functionality for the API methods themselves, receiving only a base set of HTTP wrappers.
 */
class Endpoint {

  /**
   * Whether this endpoint can be cached. This can be overwritten by children endpoints to control
   * cache behaviour.
   *
   * @return {boolean}
   */
  static get cachable () {
    return false;
  }

  /**
   * Holds the default endpoint parameters. These should be overridden to match your preference. Key names don't
   * reflect your actual parameter names but rather the names defined below
   * @see parameterNames
   *
   * @return {{paginate: boolean, limit: number, offset: number, orderDirection: string, multipleOrderColumns: boolean}}
   */
  static get defaultParameters () {
    return {
      paginate:             true,
      limit:                10,
      offset:               0,
      orderDirection:       'ASC',
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
  static get parameterNames () {
    return {
      limit:                'limit',
      offset:               'offset',
      orderDirection:       'direction',
      orderColumn:          'order_column',
      multipleOrderColumns: 'order_columns',
      filterColumns:        'filter_columns'
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
  static get mapResults () {
    return response => ( {
      results: Array.from( response.data )
    } );
  }

  /**
   * Default filter mapper. Accepts a filter list, returns a comma-separated, key=value assignment string.
   * This should be overridden if required, just make sure to return a string.
   *
   * @returns {function(filters: Object): string}
   */
  static get mapFilters () {
    return filters => Object
      .entries( filters )
      .map( ( [ field, value ] ) => `${field}:${value}` )
      .join( ',' );
  }

  /**
   * Default filter mapper. Accepts a filter list, returns a comma-separated, key=value assignment string.
   * This should be overridden if required, just make sure to return a string.
   *
   * @returns {function(filters: Object): string}
   */
  static get mapOrders () {
    return orders => Object
      .entries( orders )
      .map( ( [ field, direction ] ) => `${field}:${direction}` )
      .join( ',' );
  }

  /**
   * Creates a new endpoint
   */
  constructor () {

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
    if ( this.constructor.cachable ) {

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
  mount ( api ) {
    this.api = api;
  }

  get defaultParameters () {
    return this.constructor.defaultParameters;
  }

  get parameterNames () {
    return this.constructor.parameterNames;
  }

  /**
   * Flushes the endpoint cache. To remove a single entry from the cache, its path can be passed as
   * a string. Otherwise, all cached items will be cleared.
   *
   * TODO: To be actually useful, some measure to determine new resources needs to be implemented.
   *
   * @param {String} [path] path to flush. Will clear the entire cache, if omitted.
   */
  flushCache ( path = null ) {
    if ( this.constructor.cachable ) {
      if ( path ) {
        this.cache.delete( path );
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
  async get ( path, options, ...args ) {
    if ( this.constructor.cachable ) {
      const cacheUrl = new URL( path, this.api.baseUrl );

      for ( let [ name, value ]of Object.entries( options.params || {} ) ) {
        cacheUrl.searchParams.append( name, value );
      }

      if ( this.cache.has( cacheUrl.toString() ) ) {
        const response = this.cache.get( cacheUrl.toString() );

        response.fromCache = true;

        return response;
      }

      // storing the response promise, implementations won't notice whether they're using a new
      // response or the cached one.
      const response = new ApiResponse(
        await this.api.http.get( path, options, ...args ),
        this.constructor.mapResults
      );

      // cache the response
      this.cache.set( response.url, response );

      return response;
    }

    // return the wrapped response
    return new ApiResponse( await this.api.http.get( path, options, ...args ), this.constructor.mapResults );
  }

  /**
   * Performs a DELETE request.
   *
   * @param  {String}        path path to the resource
   * @param  {*}             args arguments to the adapter method
   * @return {Promise<*>}         response promise
   */
  delete ( path, ...args ) {
    return this.api.http.delete( path, ...args );
  }

  /**
   * Performs a POST request.
   *
   * @param  {String}        path path to the resource
   * @param  {Object}        data request body data
   * @param  {*}             args arguments to the adapter method
   * @return {Promise<*>}         response promise
   */
  post ( path, data, ...args ) {
    return this.api.http.post( path, data, ...args );
  }

  /**
   * Performs a PUT request.
   *
   * @param  {String}        path path to the resource
   * @param  {Object}        data request body data
   * @param  {*}             args arguments to the adapter method
   * @return {Promise<*>}         response promise
   */
  put ( path, data, ...args ) {
    return this.api.http.put( path, data, ...args );
  }

  /**
   * Performs a PATCH request.
   *
   * @param  {String}        path path to the resource
   * @param  {Object}        data request body data
   * @param  {*}             args arguments to the adapter method
   * @return {Promise<*>}         response promise
   */
  patch ( path, data, ...args ) {
    return this.api.http.patch( path, data, ...args );
  }
}

/**
 * @type {Endpoint}
 */
export default Endpoint;
