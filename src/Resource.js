'use strict';

import Endpoint from './Endpoint';

/**
 * Generic abstraction to represent a CRUD resource. Resources can be fetched, created, updated and
 * destroyed. Additionally, they provide some convenience methods and can be configured using the
 * same static getters available from the Endpoint object.
 *
 * @property {String}      path
 * @property {AxiosStatic} http
 */
class Resource extends Endpoint {
  constructor () {
    super();

    this._activeOptions = {
      parameters: {}
    };
  }

  /**
   * Default path. Should be overwritten in children resources
   *
   * @returns {String}
   */
  static get path () {
    return '/' + this.name.toLowerCase();
  }

  /**
   * Retrieves the endpoint path from the static property
   *
   * @returns {String}
   */
  get path () {
    return this.constructor.path;
  }

  /**
   * Fetches all entities
   *
   * @param   {Object} [options]
   *
   * @returns {Promise<ApiResponse>}
   */
  index ( options = {} ) {

    // merge endpoint defaults with specific options
    const mergedOptions  = Object.assign( {}, this.constructor.defaultParameters, this._activeOptions, options );
    const requestOptions = {
      params: Object.assign(
        {},
        this._activeOptions.parameters,
        options.parameters
      )
    };

    if ( mergedOptions.headers ) {
      requestOptions.headers = mergedOptions.headers;
    }

    if ( mergedOptions.paginate ) {
      requestOptions.params[ this.constructor.parameterNames.limit ]  = mergedOptions.limit;
      requestOptions.params[ this.constructor.parameterNames.offset ] = mergedOptions.offset;
    }

    if ( mergedOptions.orderColumn ) {
      requestOptions.params[ this.constructor.parameterNames.orderColumn ]    = mergedOptions.orderColumn;
      requestOptions.params[ this.constructor.parameterNames.orderDirection ] = mergedOptions.orderDirection;
    }

    if ( mergedOptions.orderColumns ) {
      const orderColumns = Object.entries( mergedOptions.orderColumns );

      if ( orderColumns.length === 1 ) {
        requestOptions.params[ this.constructor.parameterNames.orderColumn ]    = orderColumns[ 0 ][ 0 ];
        requestOptions.params[ this.constructor.parameterNames.orderDirection ] = orderColumns[ 0 ][ 1 ];
      } else {
        requestOptions.params[ this.constructor.parameterNames.orderColumns ] = this.constructor.mapOrders(
          mergedOptions.orderColumns
        );
      }
    }

    if ( mergedOptions.filterColumns ) {
      requestOptions.params[ this.parameterNames.filterColumns ] = this.constructor.mapFilters(
        mergedOptions.filterColumns
      );
    }

    // reset all active options after building the request options
    this._resetOptions();

    // noinspection JSCheckFunctionSignatures
    return this.get( this.path, requestOptions );
  }

  /**
   * Fetches all entities
   *
   * @param   {Object}         [options]
   * @returns {Promise<Array>}
   */
  async all ( options = {} ) {
    options.paginate = false;

    const response = await this.index( options );

    return response.results;
  }

  /**
   * Fetches a single entity
   *
   * @param   {Number}     id
   * @param   {Object}     [options]
   * @returns {Promise<*>}
   */
  async one ( id, options = {} ) {
    const response = await this.get( `${this.path}/${id}`, options );

    return response.first;
  }

  /**
   * Creates a new entity
   *
   * @param   {Object}     data
   * @param   {Object}     [options]
   * @returns {Promise<*>}
   */
  create ( data, options = {} ) {
    return this.post( this.path, data, options );
  }

  /**
   * Updates an entity
   *
   * @param   {Number}     id
   * @param   {Object}     data
   * @param   {Object}     [options]
   * @returns {Promise<*>}
   */
  update ( id, data, options = {} ) {
    return this.put( `${this.path}/${id}`, data, options );
  }

  /**
   * Destroys an existing entity
   *
   * @param   {Number}     id
   * @param   {Object}     [options]
   * @returns {Promise<*>}
   */
  destroy ( id, options = {} ) {
    return this.delete( `${this.path}/${id}`, options );
  }

  /**
   * Resets the chain options
   *
   * @private
   */
  _resetOptions () {
    this._activeOptions = {};
  }

  paginate (
    limit  = this.defaultParameters.limit,
    offset = this.defaultParameters.offset
  ) {
    this._activeOptions.paginate = true;
    this._activeOptions.limit    = limit;
    this._activeOptions.offset   = offset;

    return this;
  }

  orderBy ( field, direction = this.defaultParameters.direction ) {
    if ( !this._activeOptions.hasOwnProperty( 'orderColumns' ) ) {
      this._activeOptions.orderColumns = {};
    }

    this._activeOptions.orderColumns[ field ] = direction;

    return this;
  }

  filterBy ( field, value ) {

    // if the parameter is explicitly disabled, we'll assume there is no such param and any filters
    // should just be appended as ordinary URL parameters.
    if ( this.constructor.parameterNames.filterColumns === null ) {
      this._activeOptions.parameters[ field ] = value;
    } else {
      if ( !this._activeOptions.hasOwnProperty( 'filterColumns' ) ) {
        this._activeOptions.filterColumns = {};
      }

      this._activeOptions.filterColumns[ field ] = value;
    }

    return this;
  }
}

export default Resource;
