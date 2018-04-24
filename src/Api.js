'use strict';

import axios    from 'axios';
import Endpoint from './Endpoint';

/**
 * API base class
 * Provides an entry point to the API abstraction. Basically, Api revolves around the concept of endpoints.
 * An endpoint, in code terms, represents the respective HTTP endpoint of the remote API. It provides
 * methods for all available functionality on the remote endpoint but abstracts away the actual HTTP
 * communication. This makes it possible to define remote URIs in one place instead of being scattered
 * across the application, enables testing by mocking the remote API and provides ways to modify requests
 * and responses transparently.
 */
class Api {

  /**
   * Content type for all requests and responses. This is statically fixed to JSON. Should the data type
   * ever change (to XML for example), this must be modified according to the new data MIME type.
   *
   * @return {string}
   */
  static get type () {
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
  static get adapter () {
    return axios;
  }

  /**
   * Creates a new API base class
   *
   * @param {String} baseUrl
   * @param {Object} options
   */
  constructor ( baseUrl = '/', options = {} ) {

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
    this.headers = Object.assign( {}, {
      'Content-Type':     this.constructor.type,
      'X-Requested-With': 'XMLHttpRequest'
    }, options.headers );

    this.authentication = options.authentication;

    /**
     * HTTP client instance
     *
     * @type {AxiosInstance}
     */
    this.http = this.constructor.adapter.create(
      {
        baseURL: this.baseUrl,
        headers: this.headers,
        auth:    this.authentication
      }
    );

    for ( let interceptor of options.interceptors.request ) {
      this.http.interceptors.request.use( interceptor );
    }

    for ( let interceptor of options.interceptors.response ) {
      this.http.interceptors.response.use( interceptor );
    }

    // create a set for the endpoints to be mounted
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
  mount ( endpoint ) {

    // check if this is a valid endpoint
    if ( !( endpoint instanceof Endpoint ) ) {
      throw new TypeError( 'Can only add Endpoint instances as endpoints' );
    }

    // check if this endpoint is registered already
    if ( this.endpoints.has( endpoint.name ) ) {
      throw new Error( `Mount point ${endpoint.name} is already taken` );
    }

    // Check whether the endpoint name exists as a method or property of this class, already
    if ( Object.getOwnPropertyNames( this.constructor.prototype ).includes( endpoint.name ) ) {
      throw new Error( `Can not assign endpoints to internal property ${endpoint.name}` );
    }

    // call the endpoint mount
    endpoint.mount( this );

    // add the endpoint to the endpoints list
    this.endpoints.add( endpoint );

    // add the endpoint to the instance
    this[ endpoint.name ] = endpoint;
  }
}

export default Api;
